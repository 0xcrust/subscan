use futures::{stream, StreamExt};

use std::collections::HashSet;
use std::iter::FromIterator;
use std::time::Instant;

use crate::core::ports;
use crate::core::dns;

use crate::core::models::Subdomain;
use crate::core::scanner;

use actix_web:: {HttpResponse, HttpRequest } ;

pub async fn scan(req: HttpRequest) -> HttpResponse {

    let target = req.match_info().get("domain").unwrap();

    let runtime = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .expect("Building tokio's runtime");

    let dns_resolver = dns::new_dns_resolver();

    let subdomains_concurrency = 100;
    let dns_concurrency = 200;
    let ports_concurrency = 200;
    
    let scan_start_time = Instant::now();

    let subdomains_modules = scanner::get_scanners();

    runtime.block_on(async move {
        // Scan subdomains using all the different scanners in the subdomain scanner module
        // and collect the results into a single String vector.

        let mut subdomains: Vec<String> = stream::iter(subdomains_modules.into_iter())
            .map(|module| async move {
                match module.get_subdomains(target).await {
                    Ok(new_subdomains) => Some(new_subdomains),
                    Err(err) => {
                        log::error!("subdomains/{}: {}", module.name(), err);
                        None
                    }
                }
            })
            .buffer_unordered(subdomains_concurrency)
            .filter_map(|domain| async { domain })
            .collect::<Vec<Vec<String>>>()
            .await
            .into_iter()
            .flatten()
            .collect();

        subdomains.push(target.to_string());

        // Clean results using a hashset to prevent duplicates.
        // 
        let subdomains: Vec<Subdomain> = HashSet::<String>::from_iter(subdomains.into_iter())
            .into_iter()
            .filter(|subdomain| subdomain.contains(target))
            .map(|domain| Subdomain {
                domain_name: domain,
                open_ports: Vec::new(),
            })
            .collect();

        log::info!("Found {} possible domains.", subdomains.len());

        // Concurrently filter out domains that do not resolve according the Domain Naming System.
        // 
        let subdomains: Vec<Subdomain> = stream::iter(subdomains.into_iter())
            .map(|domain| dns::resolve_dns(&dns_resolver, domain))
            .buffer_unordered(dns_concurrency)
            .filter_map(|domain| async move { domain })
            .collect()
            .await;

        log::info!("Found {} domains that resolve!", subdomains.len());

        // Scan each subdomain for its open ports
        // 
        let subdomains: Vec<Subdomain> = stream::iter(subdomains.into_iter())
            .map(|domain| {
                log::info!("Scanning ports for {}", &domain.domain_name);
                ports::scan_ports(ports_concurrency, domain)
            })
            .buffer_unordered(1)
            .collect()
            .await;

        for subdomain in &subdomains {
            println!("{}", subdomain.domain_name);
            for port in &subdomain.open_ports {
                println!("    {}", port.port);
            }
        }
    });

    let scan_duration = scan_start_time.elapsed();
    log::info!("Scan completed in {:?}", scan_duration);

    HttpResponse::Ok().await.unwrap()
}
