// use color_eyre::eyre::Ok;
// use color_eyre::eyre::Ok;
use spandoc::spandoc;
use tracing::{debug, field, info};
use ts_engine_rs::{
    JsRuntime, RuntimeOptions,
    errors::{AppError, AppResult},
    eval,
    init::init,
};

#[spandoc]
// #[tracing::instrument]
#[tokio::main]
async fn main() -> AppResult<()> {
    // init().map_err(AppError::from)?;
    init()?;

    let mut runtime = JsRuntime::new(RuntimeOptions::default());
    let code = "let a = 1+4; a*2";
    info!("example usage of eval of code:\n\t{}\n", &code);
    debug!("\n*************\n{}\n*************\n", &code);
    let output: serde_json::Value = eval(&mut runtime, code).expect("Eval failed");
    info!("Output: {output:?}");
    let expected_output = serde_json::json!(10);
    assert_eq!(expected_output, output);
    Ok(())
}
