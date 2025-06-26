use color_eyre::Report;
use std::fmt::{Debug, Display};
// use deno_core::error::format_location;
use tracing::{error, Span};
#[allow(unused)]
use tracing_subscriber::prelude::*;

pub use color_eyre::eyre::{Context, Result, anyhow};
// use tracing_forest::util::*;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),
    /// Other errors
    #[error("Other error: {message}")]
    Other { message: String },
    #[error("Error: {message}")]
    MsgError { message: String },
    #[error(transparent)]
    Report(#[from] Report),
}
impl AppError {
    pub fn with_msg(msg: impl Display) -> Self {
        AppError::MsgError {
            message: msg.to_string(),
        }
    }
}
pub type AppResult<T> = Result<T, AppError>;

pub trait ResultNote {
    fn add_note_lazy(&self, note: impl FnOnce() -> String) -> &Self;
}

impl<T> ResultNote for AppResult<T> {
    #[tracing::instrument(skip(self, note))]
    fn add_note_lazy(&self, note: impl FnOnce() -> String) -> &Self {
        let curr_span = Span::current();
        if self.is_err() {
            let note = note();
            error!(error = " error message ", note = note);
        }
        //    &self.wrap_err_with(note);

        ///SPANDOC: hope it wil work
        &self
    }
}
