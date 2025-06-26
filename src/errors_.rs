use std::{
    backtrace::{self, Backtrace},
    fmt::{Debug, Display, format},
    iter,
    ops::Not,
    thread,
    time::Duration,
};

use deno_core::futures::stream::iter;
// use deno_core::error::format_location;
use owo_colors::OwoColorize;
use tracing::{Span, field, instrument};
use tracing_error::ExtractSpanTrace as _;
#[allow(unused)]
use tracing_subscriber::prelude::*;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use std::error::Error as StdError;
use tracing_forest::{ForestLayer, Tag, traits::*, util::*};
macro_rules! try_bool {
    ($e:expr, $dest:ident) => {{
        let ret = $e.unwrap_or_else(|e| $dest = Err(e));

        if $dest.is_err() {
            return false;
        }

        ret
    }};
}
#[macro_export]
macro_rules! add_err_ctx {
    ($msg:expr) => {{
        // let s=Span;
      ||{  let span = info_span!("error_note", note = field::Empty, location = field::Empty);
        let currspan = Span::current();
        info!("daaamn!!!");
        currspan.record("note", "its a xxxxx");
        span.follows_from(Span::current());

        let _e = span.enter();
        span.record("note", "its a notice");
        span.record("note", "notice has changed");
        // record!("Sss","sss");
        let file_src = file!();
        let line = line!();
        let column = column!();
        let location = format!("{file_src}:{line}:{column}\nmsg: {}", $msg);
        span.record("location", &location);
        // span.exit();
        location}
    }};
}

pub trait ResultNote {
    fn add_note_lazy(self, note: impl FnOnce()->String) ->Self;
}

impl<T> ResultNote for AppResult<T>{
    fn add_note_lazy(self,note: impl FnOnce()->String) ->Self {
       let curr_span=Span::current();

//        self.map_err(|e|{
//         let span = info_span!("error_note", note = field::Empty);
//         span.follows_from(curr_span);
//         let _e=span.enter();
//         // span.in_scope(|| {
// let note_r=note();
//             span.record("note", &note_r);
//             tracing::info!(maaan="damn error", note= &note_r);
//             // return e;
//     e
//         })
        
self
    

    }
}

#[derive(Debug, thiserror::Error)]
#[error("{0}")]
struct ErrorMsg(&'static str);

use std::{error::Error, fmt};
use tracing_error::SpanTrace;
// #[derive(Debug)]
#[derive(thiserror::Error)]
pub struct AppError {
    context: SpanTrace,
    location: String,
    //   location: Option<&'static std::panic::Location<'static>>,
    backtrace: Option<Backtrace>,
    msg: Option<String>, // ...
}

#[derive(Debug)]
pub struct AppErrorDbg {
 msg: Option<String>,
location: String,

}
impl From<AppError> for AppErrorDbg{
    fn from(value: AppError) -> Self {
        AppErrorDbg{
            msg:value.msg,
            location:value.location
        }
    }
}

impl From<&AppError> for AppErrorDbg{
    fn from(value: &AppError) -> Self {
        AppErrorDbg{
            msg:value.msg.clone(),
            location:value.location.clone()
        }
    }
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        fn format_header(header: &str) -> String {
            format!("{:<12}", header.bold())
        }
        fn write_hr(f: &mut fmt::Formatter<'_>, is_main: bool) -> fmt::Result {
            let mut hr = "======================================================"
                .black()
                .on_red()
                .to_string();
            if !is_main {
                hr = "======================================================"
                    .red()
                    .on_black()
                    .to_string();
            }
            let hr = format!("\n{}\n", hr);
            f.write_str(hr.as_str())?;
            Ok(())
        }

        // ... format other parts of the error ...
        write_hr(f, true)?;

        if let Some(backtrace) = self.backtrace.as_ref() {
            let backtrace_display = format!("{backtrace:?}");
            if backtrace_display != "<disabled>" {
                writeln!(f, "\n\nBacktrace:\n{:?}", backtrace)?;
                write_hr(f, false)?;
            }
        }

        if let Some(msg) = &self.msg {
            f.write_str(format!("\n{}{}\n\n", format_header("MSG:"), msg.blue()).as_str())?;
        }

        f.write_fmt(format_args!(
            "\n{}{}\n",
            format_header("LOCATION:"),
            &self.location.blue()
        ))?;


        f.write_fmt(
            format_args!("SPANTRACE:\n\n{}\n\n",&self.context)
    ).unwrap();

        // spantrace

        let mut err = Ok(());
        let mut span = 0;

        self.context.with_spans(|metadata, fields| {
            if span > 0 {
                try_bool!(write!(f, "\n",), err);
            }

            if let Some((file, line)) = metadata
                .file()
                .and_then(|file| metadata.line().map(|line| (file, line)))
            {
                try_bool!(write!(f, "\t{}{}:{}\n", "└── ".yellow(), file, line), err);
            }
            try_bool!(
                write!(
                    f,
                    "\t\t\t{} {:<4}: {}::{}",
                    "└── ".yellow(),
                    span.green(),
                    metadata.target().blue(),
                    metadata.name().bright_blue()
                ),
                err
            );

            if !fields.is_empty() {
                try_bool!(write!(f, "{}", fmt_values(fields)), err);
            }
            span += 1;
            true
        });

        //end of spantrace

        write_hr(f, true)?;

        // ... format other error context information, cause chain, etc ...
        Ok(())
    }
}

// impl Error for AppError {}

impl Debug for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // let apperrdbg:AppErrorDbg=self.into();
        f.debug_struct("AppError").field("msg", &self.msg).field("location", &self.location).finish()
        // f.write_fmt(format_args!("App Error @ {} {:?}",&self.location,&self.msg.clone().map(|x|format!(" with message: {}",x)).unwrap_or("".to_string())))

        // f.write_fmt(format_args!("App Error @ {} {:?}",&self.location,&self.msg.clone().map(|x|format!(" with message: {}",x)).unwrap_or("".to_string())))
    }
}

impl From<String> for AppError {
    fn from(value: String) -> Self {
        AppError::with_msg(value)
    }
}

impl From<Box<dyn Error>> for AppError {
    fn from(value: Box<dyn Error>) -> Self {
        AppError::with_msg(value.to_string())
    }
}
impl From<Box<dyn std::error::Error + Send + Sync + 'static>> for AppError {
    fn from(value: Box<dyn std::error::Error + Send + Sync + 'static>) -> Self {
        AppError::with_msg(value.to_string())
    }
}

impl AppError {
    fn track_caller(&mut self, location: &'static std::panic::Location<'static>) {
        self.location = format!(
            "\n{file_src}:{line}:{column}",
            file_src = location.file(),
            line = location.line(),
            column = location.column()
        );
    }
    #[track_caller]
    // #[tracing::instrument]
    fn get_location() -> String {
        // let file_src=file!();
        // let line=line!();
        // let column = column!();

        let location = std::panic::Location::caller();
        format!(
            "\n{file_src}:{line}:{column}",
            file_src = location.file(),
            line = location.line(),
            column = location.column()
        )
    }
    //  #[track_caller]
    // #[tracing::instrument(skip(msg))]
    pub fn with_msg(msg: impl Display) -> Self {
        Self {
            context: SpanTrace::capture(),
            msg: Some(format!("{msg}")),
            ..Default::default()
        }
    }
    #[track_caller]
    #[tracing::instrument]
    pub fn with_location(self, location: &std::panic::Location<'_>) -> Self {
        let location = format_location(location);
        let ctx = self.context.clone();
        //    let msg=&self.msg;
        let backtrace = self.backtrace;
        Self {
            context: ctx,
            location,
            backtrace,
            msg: self.msg,
        }
    }
    pub fn new() -> Self {
        Self {
            context: SpanTrace::capture(),
            msg: None,
            ..Default::default()
        }
    }

    fn debug(&self, error: &(dyn Error + 'static), f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let errors = iter::successors(Some(error), |error| (*error).source());

        for (ind, error) in errors.enumerate() {
            write!(f, "\n{:>4}: {}", ind, error)?;
        }

        if let Some(backtrace) = self.backtrace.as_ref() {
            writeln!(f, "\n\nBacktrace:\n{:?}", backtrace)?;
        }

        if let Some(msg) = self.msg.as_ref() {
            writeln!(f, "\n\n{}", msg)?;
        }
        Ok(())
    }
}
impl Default for AppError {
    fn default() -> Self {
        let spantrace = SpanTrace::capture();
        let backtrace = Backtrace::capture();
        // let backtrace=Backtrace::force_capture();

        // spantrace

        AppError {
            context: spantrace,
            location: AppError::get_location(),
            msg: None,
            backtrace: Some(backtrace),
        }
    }
}
// pub fn get_deepest_spantrace<'a>(
//     error: &'a (dyn std::error::Error + 'static),
// ) -> Option<&'a SpanTrace> {
//     eyre::Chain::new(error)
//         .rev()
//         .flat_map(|error| error.span_trace())
//         .next()
// }
#[repr(transparent)]
pub(crate) struct BoxedError(pub(crate) Box<dyn StdError + Send + Sync>);

impl std::fmt::Debug for BoxedError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        std::fmt::Debug::fmt(&self.0, f)
    }
}

impl Display for BoxedError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        Display::fmt(&self.0, f)
    }
}

impl StdError for BoxedError {
    // fn provide<'a>(&'a self, request: &mut std::error::Request<'a>) {
    //     self.0.provide(request);
    // }

    fn source(&self) -> Option<&(dyn StdError + 'static)> {
        self.0.source()
    }
}

pub type AppResult<T> = Result<T, AppError>;
fn format_location(location: &std::panic::Location<'_>) -> String {
    format!(
        "\n{file_src}:{line}:{column}",
        file_src = location.file(),
        line = location.line(),
        column = location.column()
    )
}

// #[tracing::instrument]

fn fmt_values(input: &str) -> String {
    use owo_colors::OwoColorize as _;
    let eq_sign_formated = "=".truecolor(100, 100, 100).to_string();
    let char_eq = '=';
    let char_sep = ' ';
    fn format_var(k: &String, v: &String) -> String {
        let kf = format!("   └── {:<15}: ", k);
        format!("{} {}", kf.bright_green(), v)
    }
    let mut parts: Vec<(String, String)> = Vec::new();
    let mut keys: Vec<String> = Vec::new();
     let mut part= String::from("");
    let mut key=String::from("");
        let mut need_new_key=true;

   let splited:Vec<&str>=input.split(char_eq).collect();
   for chunk  in splited{
    if need_new_key {
        need_new_key=false;
        key=format!("{chunk}");
    } else {
        part.push_str(&chunk);
        if &part.split('(').count()== &part.split(')').count() && &part.split('"').count()%2==0 {
            parts.push((key.clone(), part.clone()));
            key.clear();
            part.clear();
            need_new_key=true;
        }
    }
   }


let formated_kv:Vec<String>=parts.iter().map(|(k,v)| format_var(&k.to_string(),& v.to_string())).collect();

format!("\n{}",formated_kv.join("\n"))


}


pub fn install_panic_hook(){
        std::panic::set_hook(Box::new(move |panic_info| {
        let def_fmt = "\n".on_default_color();
        let def_fmt = def_fmt.default_color();

        let title = format!("{def_fmt}💩🔥 {}{def_fmt}", "💩 panic occurred:".on_red());
        let mut msg = String::from("panic - unknown panic details");
        if let Some(s) = panic_info.payload().downcast_ref::<&str>() {
            msg = format!("{s:?}");
        } else if let Some(s) = panic_info.payload().downcast_ref::<String>() {
            let s = s.clone();
            msg = s;
        }
        if let Some(location) = panic_info.location() {
            let err = AppError::with_msg(msg).with_location(location);
            eprintln!("{title} {err}");
        } else {
            let err = AppError::with_msg(msg);
            eprintln!("{title} {err}");
        }
    }));
}