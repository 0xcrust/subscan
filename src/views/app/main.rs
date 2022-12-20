use actix_web::HttpResponse;
use super::loader::read_file;


pub async fn main() -> HttpResponse {
    let mut html = read_file(
        String::from("./app/main.html"));

    let javascript = read_file(
        String::from("./app/app.js"));

    let css = read_file(
        String::from("./app/styles.css"));
        
    html = html.replace("{{JAVASCRIPT}}", &javascript)
        .replace("{{CSS}}", &css);
    
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(html)
}