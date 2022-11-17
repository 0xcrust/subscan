mod endpoints;
mod path;

use actix_web::web;
use path::Path;


pub fn views_factory(app: &mut web::ServiceConfig) {
    let base_path = Path 
    {
        prefix: String::from(""),
        backend: true,
    };

    app.route(&base_path.define(String::from("/scan/{domain}")),
                web::get().to(endpoints::scan::all::scan))
        .route(&base_path.define(String::from("/about")),
                web::get().to(endpoints::about::about))
        .route(&base_path.define(String::from("/help")),
                web::get().to(endpoints::help::help))
        .route(&base_path.define(String::from("/scanners")),
                web::get().to(endpoints::about::list_scanners));
}