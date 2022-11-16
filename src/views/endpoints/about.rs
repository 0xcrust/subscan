use crate::core::scanner;

pub fn list_scanners() {
    let subdomain_scanners = scanner::get_scanners();

    println!("\nSubdomain scanners:");
    for scanner in subdomain_scanners {
        println!("*    {}\n\t{}", scanner.name(), scanner.about());
    }
}

pub fn about() {
    println!("Welcome to crusty_scanner!\n");
    println!("Authored by: Fatoke Ademola Paul(crusty dev)");
    println!("Written in: The Rust Programming Language");
    println!("Inspiration drawn from: tricoder by Sylvain Kerkour");
    println!("What it does: Scans a target domain for its subdomains and their open ports");
    println!("Enjoy using!");
}

