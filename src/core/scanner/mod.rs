mod traits;
mod methods;

use traits::SubdomainScanner;

pub fn get_scanners() -> Vec<Box<dyn SubdomainScanner>> {
    return vec![
        Box::new(methods::BruteForceScan::new()),
        Box::new(methods::CrtShScan::new()),
        Box::new(methods::ThreatCrowdScan::new()),
        Box::new(methods::ThreatMinerScan::new()),
        Box::new(methods::WebArchiveScan::new()),
    ];
}

pub fn bruteforce_scan() -> Box<dyn SubdomainScanner>{
    Box::new(methods::BruteForceScan::new())
}

pub fn crtsh_scan() ->Box<dyn SubdomainScanner> {
    Box::new(methods::CrtShScan::new())
}

pub fn threatcrowd_scan() -> Box<dyn SubdomainScanner> {
    Box::new(methods::ThreatCrowdScan::new())
}

pub fn threatminer_scan() -> Box<dyn SubdomainScanner> {
    Box::new(methods::ThreatMinerScan::new())
}

pub fn webarchive_scan() -> Box<dyn SubdomainScanner>{
    Box::new(methods::WebArchiveScan::new())
}

