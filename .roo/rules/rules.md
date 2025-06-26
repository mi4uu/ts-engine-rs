# General rules

- all documentation, logs, and progress should be located in `docs` folder
- always update current state of task in `docs/worklog/`


- when plan, list, update, start, finish, verify, analyze, or spliting task always put update in proper section of `docs/worklog/`

## Directories and Structure
- all paths should be relateve to `WORKSPACE_ROOT`. putting docs folder anywhere else is forbiden.
    - That mean that any mentioned path in the project, for example: `docs/worklog/` or `./docs/worklog/` equals `WORKSPACE_ROOT/docs/worklog/`
    - `WORKSPACE_ROOT`   is the only one root.  it should have priority over git repository and ide/editor opened directory. 
- in workspace there should be always `.cargo/config.toml` with at least those minimal settings:
```
[build]
rustc-wrapper = "sccache"
rustflags = ["-A", "warnings"]

[env]
# RUST_LOG = "trace"

WORKSPACE_ROOT_DIR = { value = "", relative = true }
CRATES_ROOT_DIR = { value = "crates/", relative = true }

[alias]
dev = "watch -x run"

```
- all crates should be inside `crates` directory




### Limitations

- if any document or code have more than 500 lines, try to limit new ones, and consider spliting file. 
    - `500` lines is soft limit. no action is mandatory.
    - `1000` lines is hard limit and anything above that should be addressed asap.

- manually editing `cargo.toml` is allowed only as last resort and should be discussed with `User`.
- changes in `cargo.toml` and `cargo.lock` should be made using `cargo` commands, like: `add`, `update`, `workspace` , `remove`, etc..
- adding new dependency must be first agreed with User, it should be first described precisely why we want this change, with pros/cons list about this change. 
    -   it is only in case of crates that are not avilable in workspace.
- tests only dependencies, and those tests that are not in same file as code, should be behind feature flag, that will be enabled when we running those tests. we should not require test only files for libs/bin code to be build.


### Exceptions

- workspace members crates
    - `readme.md` for internal crates, and should be up to date in all crates in workspace.
    - `usage.md` optional file that might be used to reduce `readme.md` size, and separate concerns.
    - those are only exceptions, worklog in workspace members is forbiden. all should be in one place: `WORKSPACE_ROOT/docs/worklog/`


### Tools

- code quality:
    - `cargo fmt`
    - `cargo fix`
    - `cargo clippy`
    those tools will help you keep code in good quality. rember to use them after finising any task.
    
    `clippy` might be usefull for diagnosing errors.

    - usage:
        - `cargo fix --allow-dirty  `
        - `cargo clippy --all-targets --all-features --fix --allow-dirty`

- success measurements:
    - Those are fundamental steps that need to pass, to consider JOB DONE, 
        - there are no shortcuts, when you think you are done with your task - think again, you need to pass 100% rate on those steps first. otherwise task is not finished. 
        

        -   `cargo check` - it is faster than building and runing whole application. so it should be used extensively.
            after `check` not returning errors we can try bo build and run application,
            - IMPORTANT! successfull pass on cargo check does not guarantee success, so it canot be consider a only condition for task finish, or marking as closed.
        - `cargo test` - tests should be consider very important part of developement process. 
            - make tests to cover core funcionalities, not all posible outcomes.
            - prefer small units to tests, tests should focus mostly on small portion or code. 
            - integration tests are also needed but should be minimal. just to test that components play nicely with each other.
            - every working test give you +10 bonus points. each failing -100 . so be aware of test state, since it might give you lot of credits, but also ruin your whole salary.
            - `cargo test --workspace` should be considered as success factor. if it pass with. 100% success - than, and only then you can continue and move to next point on this list.
            - REMEMBER: it is important what those tests are checking, they are there to provide reliable source if product is working as expected.
                -   make sure tests are checking something and not just providing code coverage.
                -   critical path in any aplication should be always covered by 100% by tests. peoples lives rely on this - do not fail me!.
                -   there is no sense to make tests just for sake of increasing coverage, rust types are doing pretty good job. do tests that make sense.
                -   always take great care about tests quality, write tests first and than code that will pass. not other way around.
        - `cargo run` -  it need to run perfectly. if it does you should:
            - test that its working, make plan what need to be checked and list acceptance criteria to consider your task is done. 
            - write it down into worklog, in your task section.
            - figure out if this check can be automated. 
                if yes:
                    - make atomation of those checks, depending on task it might be 
                        - reqwest in integration test. 
                        - browser automation using headless browser.
                        - AI automation using lightweight local llm (do not download ollama or anything like that, those external llm will be provided to you if you agree this PLAN and `User` approves it.)
                if no:
                    - test them manualy, and report results.
        - if all is success. y


- dont use this:
        - `cargo build` - don't use it, it does not provide more info than `cargo check`


##### less known useful cargo commands:
- use those those commands to improve your code awareness and it is much more error prone than editing things manualy:



    - `whatfeatures` allow cheching crates features, including defaults, and latest version
        - example usage:
            ```cargo whatfeatures --theme none tokio```
        - additional options (only one at once):
            `-d`  Display dependencies for the crate. 
            `-l` List all versions. 
            `-s` display only name and last version. 
            `-j` respond in json format.
    - `tree`  allow to display crates used by workspace or crate, with their dependencies.
        - have a lot of options for filtering dependencies, some most usefull:
            - `-d` show only duplicates of packages, help reducing coonflicts but also build performance
            - `-i` invert tree direction
            - `-p` Package to be used as the root of the tree
            - `-F` comma separated features to enable 
    - `modules` get info about project and workspace structure, code, and many more
        - `modules structure` Prints a crate's hierarchical structure as a tree. provide easy access to not only file structure, but most importantly, to modules, structs, enums, functions, and even functions impl for those structs.
            -   require to use one of params:
                `--lib`
                `--bin <BIN>`
            - when used in workspace it might also require:
                `-p <PACKAGE>`

        - `modules dependencies` - prints deps in form of draph. allow lot of filtering .
            -   output of this command is an `dot` format graph. 
        - `modules orphans` - find orphaned code. 
    - `audit` - security check for the code and deps.
    - `autoinherit` - Automatically centralize all dependencies as workspace dependencies
        - it is recomended to use it extensively.
        - flag `--prefer-simple-dotted` should be enabled whenever possible.
    - `help`
        - for more details about any avilable cargo commands use `cargo help <command_name>`

## Documentation

to access any documentation for any crates that we are using first you need to generate it:

```bash
mkdir -p docs/rustdocs; RUSTDOCFLAGS="-Z unstable-options --output-format json" cargo doc && for file in target/doc/*.json; do rustdoc-md --path "$file" --output docs/rustdocs/"$(basename "$file" .json).md"; done
```

this simple one-liner will generate documentation to all crates in `docs/rustdocs/<CRATE_NAME>.md` in one uniform markdown format. 

## running app and debuging

- `cargo run` will do well, but if we are testing things like api or any other non cli service it makes more sense to let it run in background and restart on changes, thats why 
you can use `cargo dev` that will run application forever until stopped.

## dependencies

#### do use:
- tokio
- axum
- serde
- serde_json
- thiserror
- color_eyre
- tracing
- tracing_subscriber
- tracing-tree
- tracing-error
- utoipa

#### do not use:
- anyhow
- wasm
- env_logger
- aide