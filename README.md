# ts-engine-rs: TypeScript Execution Engine with Blockchain Integration

[![Rust](https://img.shields.io/badge/Rust-1.78.0-orange.svg)](https://www.rust-lang.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Crates.io](https://img.shields.io/crates/v/ts-engine-rs.svg)](https://crates.io/crates/ts-engine-rs)

## Overview

`ts-engine-rs` is a high-performance TypeScript execution engine built in Rust, designed to provide seamless TypeScript and JavaScript execution with built-in blockchain capabilities. Leveraging Deno's V8 runtime, this library offers a powerful solution for developers seeking dynamic scripting within Rust applications.

### Key Features

- 🚀 **TypeScript Execution**: Execute TypeScript and JavaScript code directly in Rust
- 🔗 **Blockchain Integration**: Built-in support for rsquared-js blockchain library
- 🌐 **V8 Runtime**: Powered by Deno's V8 engine for high-performance execution
- 🔍 **Console Capture**: Comprehensive console output formatting
- ⏳ **Async Support**: Full async/await and timer functionality
- 🔐 **Blockchain Key Generation**: Private and public key generation utilities

## Quick Start

### Installation

Add `ts-engine-rs` to your `Cargo.toml`:

```toml
[dependencies]
ts-engine-rs = "0.1.0"
```

### Basic Usage

#### JavaScript Evaluation

```rust
use ts_engine_rs::eval;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let result = eval("console.log('Hello, TypeScript!'); 2 + 2")?;
    println!("Result: {}", result);
    Ok(())
}
```

#### TypeScript Execution with Blockchain

```rust
use ts_engine_rs::TypeScriptEngine;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut engine = TypeScriptEngine::new();
    
    // Execute TypeScript with blockchain integration
    let script = r#"
        import * as rsq from "rsquared-js";
        let seed = "your brain key seed";
        let privateKey = rsq.PrivateKey.fromSeed(seed);
        console.log(privateKey.toWif());
    "#;
    
    engine.execute_main_ts(script)?;
    Ok(())
}
```

## Features in Depth

### TypeScript Execution

- Simplified TypeScript-to-JavaScript conversion
- Direct execution of TypeScript and JavaScript code
- Console output capture and formatting
- Async/await and timer support

### Blockchain Integration

- Private/public key generation
- Integration with rsquared-js blockchain library
- Support for GraphQL-based blockchain operations
- Key generation from brain keys

## Error Handling

`ts-engine-rs` uses `color-eyre` and `thiserror` for robust error management:

```rust
use ts_engine_rs::TSEngineError;

// Comprehensive error types with context
match eval("invalid typescript") {
    Ok(_) => println!("Execution successful"),
    Err(e) => eprintln!("Execution failed: {}", e),
}
```

## Performance and Dependencies

- **Runtime**: Deno V8 engine
- **Async Runtime**: Tokio
- **Serialization**: Serde
- **Error Handling**: color-eyre, thiserror
- **Logging**: tracing ecosystem

## Testing

Run the comprehensive test suite:

```bash
cargo test
```

Test coverage includes:
- Basic JavaScript evaluation
- TypeScript engine initialization
- Console output formatting
- TypeScript-to-JavaScript conversion
- Blockchain key generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Deno](https://deno.land/) for the V8 runtime
- [rsquared-js](https://github.com/r-squared-project) blockchain library

## Contact

For questions, issues, or discussions, please open an issue on our GitHub repository.