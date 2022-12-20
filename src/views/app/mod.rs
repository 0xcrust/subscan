mod loader;
mod main;

use actix_web::web;
use super::path::Path;


pub fn app_factory(app: &mut web::ServiceConfig) {
    let base_path: Path = Path{
        prefix: String::from("/"),
        backend: false
    };
    app.route(&base_path.define(String::from("")),
                web::get().to(main::main));
}