use serde::Serialize;
use actix_web::{Responder, Error, HttpRequest, HttpResponse};
use futures::future::{ready, Ready};

#[derive(Serialize)]
pub struct Message {
    pub content: String
}

impl Message {
    pub fn new(content: String) -> Message {
        Message { content }
    }
}

impl Responder for Message {
    type Error = Error;
    type Future = Ready<Result<HttpResponse, Error>>;

    fn respond_to(self, _req: &HttpRequest) -> Self::Future {
        let body = serde_json::to_string(&self).unwrap();
        ready(Ok(HttpResponse::Ok()
                .content_type("application/json")
                .body(body)))
    }
}