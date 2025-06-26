use tracing::instrument;
#[allow(unused)]
use tracing_subscriber::prelude::*;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::errors::AppError;

#[tracing::instrument]
pub fn init() -> Result<(), AppError> {
    // Initialize tracing
    install_tracing();

    color_eyre::install()?;

    Ok(())
}

#[instrument]
fn install_tracing() {
    use tracing_error::ErrorLayer;
    use tracing_subscriber::prelude::*;
    use tracing_subscriber::{EnvFilter, fmt};

    let fmt_layer = fmt::layer().with_ansi(true).pretty().with_target(false);
    let filter_layer = EnvFilter::try_from_default_env()
        // .or_else(|_| EnvFilter::try_new("info")) .unwrap();
        .unwrap_or_else(|_| "ts_engine_rs=debug,info".into());

    let forest_layer = tracing_tree::HierarchicalLayer::default()
        .with_writer(std::io::stdout)
        .with_indent_lines(true)
        .with_indent_amount(4)
        .with_thread_names(true)
        .with_thread_ids(true)
        .with_span_retrace(true)
        .with_deferred_spans(true)
        .with_targets(true)
        .with_verbose_entry(true);
    tracing_subscriber::registry()
        .with(filter_layer)
        .with(fmt_layer)
        .with(forest_layer)
        .with(ErrorLayer::default())
        .init();
}

#[instrument]
fn _install_tracing() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "ts-enigne-rs=debug,serde=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();
}

#[instrument]
pub fn install_tracing_h() {
    let layer = tracing_tree::HierarchicalLayer::default()
        .with_writer(std::io::stdout)
        .with_indent_lines(true)
        .with_indent_amount(4)
        .with_thread_names(true)
        .with_thread_ids(true)
        .with_span_retrace(true)
        .with_deferred_spans(true)
        .with_targets(true)
        .with_verbose_entry(true);

    let subscriber = tracing_subscriber::Registry::default()
        .with(layer)
        .with(tracing_error::ErrorLayer::default());
    tracing::subscriber::set_global_default(subscriber).unwrap();
    // #[cfg(feature = "tracing-log")]
    // tracing_log::LogTracer::init().unwrap();
}
