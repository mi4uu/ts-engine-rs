use std::{fmt::{format, Display}, ops::Not, thread, time::Duration};

use tracing::{field, instrument, Span};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
#[allow(unused)]
use tracing_subscriber::prelude::*;
use tracing_error::ExtractSpanTrace as _;

use color_eyre::{config::Theme, eyre::{bail, eyre,  Report, WrapErr}, owo_colors::{style, OwoColorize}, Section};

use tracing_forest::{ForestLayer,traits::*, util::* ,Tag};
#[macro_export]
macro_rules! add_err_ctx {
    ($msg:expr) => {{
        // let s=Span;
        let span = info_span!("my_span", notice=field::Empty, location=field::Empty);
        let currspan=Span::current();
        info!("daaamn!!!");
        currspan.record("notice", "its a xxxxx");
        span.follows_from(Span::current());

let _e=span.enter();
span.record("notice", "its a notice");
span.record("notice", "notice has changed");
// record!("Sss","sss");
        let file_src=file!();
        let line=line!();
        let column = column!();
       let location= format!("{file_src}:{line}:{column}\nmsg: {}", $msg);
span.record("location",&location);
// span.exit();
location
    }};
}
pub fn init() -> Result<(), Report> {

    // Initialize tracing
    install_tracing();
    std::panic::set_hook(Box::new(move |panic_info| {
        let def_fmt="\n".on_default_color();
         let def_fmt=def_fmt .default_color();

        let title=format!("{def_fmt}💩🔥 {}{def_fmt}", "💩 panic occurred:".on_red());


        if let Some(s) = panic_info.payload().downcast_ref::<&str>() {
           let err= MyError::with_msg(format!("{s:?}"));
           eprintln!("{title} {err}")
        //  tracing::error!("💩 panic occurred: {err} ");
    } else if let Some(s) = panic_info.payload().downcast_ref::<String>() {
            let err= MyError::with_msg(s);
           eprintln!("{title} {err}")
    } else {
            let err= MyError::with_msg(format!("unknown panic details"));
                       eprintln!("{title} {err}");

        //  tracing::error!("💩 panic occurred ");
    }
        // tracing::error!("💩 panic occurred: {}",pi);
    }));


    // color_eyre::install()?;
    //  color_eyre::config::HookBuilder::new()
    //     .theme(theme())
    //     .install()
    //     .expect("Failed to install `color_eyre`");



//     color_eyre::config::HookBuilder::default()
//         .add_frame_filter(Box::new(|frames| {
//             let filters = &["custom_filter::main","tokio","core"];

//             frames.retain(|frame| {
//                 !filters.iter().any(|f| {
//                     let name = if let Some(name) = frame.name.as_ref() {
//                         name.as_str()
//                     } else {
//                         return true;
//                     };
// name.starts_with(f)
//                     // name.starts_with(f)
//                 })
//             });
//         }))
//         .install()
//         .unwrap();

    //  println!("{:?}", get_error_wrapper_2("test"));

//    let r= will_fail4(1)?;

    Ok(())
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
        "debug" =>  Tag::builder().prefix(target).level(level).icon('🐞').build(),
        _ => return None,
    })
}

#[instrument]
fn install_tracing() {
    use tracing_error::ErrorLayer;
    use tracing_subscriber::prelude::*;
    use tracing_subscriber::{fmt, EnvFilter};

    let fmt_layer = fmt::layer().with_target(false);
    let filter_layer = EnvFilter::try_from_default_env()
        // .or_else(|_| EnvFilter::try_new("info")) .unwrap();
         .unwrap_or_else(|_| "ts_engine_rs=debug,info".into());


    let tag = tracing_forest::Tag::builder()
         .prefix("security")
       .suffix("critical")
        .icon('🔐')
        .build();
       
    let forest_layer=ForestLayer::default();
        // let forest_layer=ForestLayer::new(tracing_forest::PrettyPrinter::new(),simple_tag);

    tracing_subscriber::registry()
        .with(filter_layer)
        .with(fmt_layer) 
        .with(forest_layer)
        .with(ErrorLayer::default())
        .init();
}


#[instrument]
fn _install_tracing(){
      tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "ts-enigne-rs=debug,serde=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();
}

fn theme() -> Theme {
    Theme::dark()
        // ^ use `new` to derive from a blank theme, or `light` to derive from a light theme.
        // Now configure your theme (see the docs for all options):
        .line_number(style().blue())
        .help_info_suggestion(style().red()).file(style().on_bright_black())
}




#[derive(Debug, thiserror::Error)]
#[error("{0}")]
struct ErrorMsg(&'static str);


#[instrument]
fn will_fail(input_num:usize)->color_eyre::Result<usize>  {
    if input_num>3{
        bail!("input num is > than 3 : {}",input_num);
    }
    Ok(input_num)
}


#[instrument]
fn will_fail2(input_num:usize)->color_eyre::Result<usize>  {
    use uuid::Uuid;
let id = Uuid::new_v4();

let span = info_span!("my_test_span", uuid = %id, notice=field::Empty);
let _e=span.enter();
span.follows_from(Span::current());
let mut some_input=1;
// span.in_scope(||{

    span.record("notice", "its a notice");

    some_input+=1;
        span.record("notice", format!("some input is now : {some_input}"));

//   let rr= will_fail(input_num+1)
//   .with_section(|| add_err_ctx!("dupa")).unwrap();
// });    
span.record("notice", "notice has changed");

  let rr= will_fail(input_num+1)
  .with_section(|| add_err_ctx!("dupa"))?;
    Ok(rr)
}

#[instrument]
fn will_fail3(input_num:usize)->color_eyre::Result<usize>  {
  let r= will_fail2(input_num+1).with_error(||ErrorMsg("wf3 failed")).wrap_err("wf3 wrap").with_error(MyError::new)?;
    Ok(r)
}
#[instrument]
fn will_fail4(input_num:usize)->color_eyre::Result<usize>  {
   let r=will_fail3(input_num+1) .section(add_err_ctx!("dupa2"))?;
    Ok(r)
}




use std::{fmt, error::Error};
use tracing_error::SpanTrace;
#[derive(Debug)]
pub struct MyError {
    context: SpanTrace,
    location: String,
    msg:Option<String>
    // ...
}

impl fmt::Display for MyError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // ... format other parts of the error ...

        self.context.fmt(f)?;
        f.write_fmt(format_args!("location: {}\n",&self.location))?;
        if let Some(msg) =  &self.msg {
            f.write_str(format!("\n msg: {msg}").as_str())?;
        }

        // ... format other error context information, cause chain, etc ...
        Ok(())
    }
}

impl Error for MyError {}



impl From<Report> for MyError{
    fn from(value: Report) -> Self {
        MyError::with_msg(value.to_string())
    }
}
impl From<Box<dyn Error>> for MyError{
    fn from(value: Box<dyn Error>) -> Self {
        MyError::with_msg(value.to_string())
    }
}
impl From<Box<dyn std::error::Error + Send + Sync + 'static>> for MyError {
      fn from(value:Box<dyn std::error::Error + Send + Sync + 'static>) -> Self {
        MyError::with_msg(value.to_string())
    }
}

impl MyError {
    fn get_location()->String{
        let file_src=file!();
        let line=line!();
        let column = column!();
        format!("\n{file_src}:{line}:{column}")
    }
    pub  fn with_msg(msg:impl Display)->Self{
        Self { context: SpanTrace::capture(), msg: Some(format!("{msg}")), location: MyError::get_location()}
    }
    pub fn new() -> Self {
        Self {
            context: SpanTrace::capture(),
            msg:None,
            location: MyError::get_location()
            // ... other error information ...
        }
    }
}

