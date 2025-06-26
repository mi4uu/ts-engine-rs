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
    // init_forest().await;

    // install_panic_hook();
    // ts_engine_rs::init::install_tracing_h();
    // tracing_forest::init();
    let mut runtime = JsRuntime::new(RuntimeOptions::default());
    let code = "let a = 1+4; a*2";
    info!("example usage of eval of code:\n\t{}\n", &code);
    debug!("\n*************\n{}\n*************\n", &code);
    let output: serde_json::Value = eval(&mut runtime, code).expect("Eval failed");
    info!("Output: {output:?}");
    let expected_output = serde_json::json!(10);
    // let res=testfn(1);
    let res = testfnx(1, None)?; //.add_note_lazy(|| String::from("JOOOOOOOOOOOOOOO!!!!!!"))?;
    info!("result: {}", res);
    assert_eq!(expected_output, output);
    Ok(())
}

macro_rules! make_somefn {
    ($name:ident, $wrapfn:ident, $limit:expr) => {
        #[tracing::instrument]
        fn $name(inputv:usize)->usize{
    debug!(target: "debug", "before i = {} (dbg) ",&inputv);

    let new_i=inputv+1;
    if new_i > $limit {
        tracing::error!(target: "security","new_i = {} and its more than {}", &new_i,$limit);
        panic!("thats too much");
    }
    debug!(target: "debug", "after i = {} (dbg) ",&new_i);
        // info!("i = {} (info)",&new_i);

    $wrapfn(new_i)
 }


    };
}

make_somefn!(testfn, testfn02, 5);
make_somefn!(testfn02, testfn03, 5);
make_somefn!(testfn03, testfn04, 5);

make_somefn!(testfn04, testfn05, 5);
make_somefn!(testfn05, somefn01, 5);

fn somefn01(inputv: usize) -> usize {
    
    inputv + 1
}

macro_rules! make_somefnresult {
    ($name:ident, $wrapfn:ident, $limit:expr) => {
        #[spandoc]
        #[tracing::instrument]
        fn $name(inputv:usize, some_string:Option<String>)->AppResult<usize>{
    debug!(target: "debug", "before i = {} (dbg) ",&inputv);

    let new_i=inputv+1;
    let is_odd=&new_i%2;

    if new_i > $limit {
        tracing::error!(target: "security","new_i = {} and its more than {}", &new_i,$limit);
        panic!("thats too much");
                return Err(AppError::with_msg("thats too much"));

    }
    debug!(target: "debug", "after i = {} (dbg) ",&new_i);
        // info!("i = {} (info)",&new_i);
    if is_odd==0 {
       let result=     $wrapfn(new_i,Some(format!("{} is odd", &new_i) ))
    //    .add_note_lazy(|| String::from("XXXXXXXXAAAAAOOOOYYYYYAYAYAYYAYAYAA"))
       .map_err(|e|AppError::from(e))?;
       return Ok(result);

    }


   let res= $wrapfn(new_i,None)?;
   Ok(res)
 }


    };
}
make_somefnresult!(testfnx, testfn02x, 5);
make_somefnresult!(testfn02x, testfn03x, 5);
make_somefnresult!(testfn03x, somefnmidx, 5);

make_somefnresult!(testfn04x, testfn05x, 5);
make_somefnresult!(testfn05x, somefn01x, 5);

#[spandoc]
#[tracing::instrument(ret,err,fields(note=field::Empty))]
fn somefnmidx(inputv: usize, msg: Option<String>) -> AppResult<usize> {
    let new_i = inputv + 1;
    /// SPANDOC: Doing first grab of context
    let result = testfn04x(inputv, Some("random msg".to_string()))?; //.add_note_lazy(|| "DUNNNPPPPPPPOOOOOO xD xD xD".to_string())?;
    Ok(result)
}
#[tracing::instrument(ret, err)]

fn somefn01x(inputv: usize, msg: Option<String>) -> AppResult<usize> {
    let new_i = inputv + 1;
    Ok(new_i)
}

use tracing_forest::{Tag, util::*};

async fn init_forest() {
    tracing_forest::worker_task()
        .set_tag(simple_tag)
        .build()
        .on(async {
            // Since `simple_tag` reads from the `target`, we use the target.
            // If it parsed the event differently, we would reflect that here.
            info!(target: "admin", "some info for the admin");
            error!(target: "request", "the request timed out");
            error!(target: "security", "the db has been breached");
            info!("no tags here");
        })
        .await;
}

fn simple_tag(event: &Event) -> Option<Tag> {
    let target = event.metadata().target();
    let level = *event.metadata().level();

    Some(match target {
        "security" if level == Level::ERROR => Tag::builder()
            .prefix(target)
            .suffix("critical")
            .icon('🔐')
            .build(),
        "admin" | "request" => Tag::builder().prefix(target).level(level).build(),
        _ => return None,
    })
}
