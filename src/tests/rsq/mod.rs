#[cfg(test)]
mod tests {
    use crate::*;

    #[tokio::test]
    async fn test_legacy_eval() {
        let mut runtime = JsRuntime::new(RuntimeOptions::default());
        let code = "let a = 1+4; a*2";
        let output: serde_json::Value = eval(&mut runtime, code).expect("Eval failed");
        assert_eq!(output, serde_json::json!(10));
    }

    #[tokio::test]
    async fn test_typescript_engine_creation() {
        let result = TypeScriptEngine::new();
        assert!(
            result.is_ok(),
            "Failed to create TypeScript engine: {:?}",
            result.err()
        );
    }

    #[tokio::test]
    async fn test_main_ts_execution() {
        let mut engine = TypeScriptEngine::new().expect("Failed to create engine");
        let result = engine.execute_main_ts();

        match result {
            Ok(output) => {
                println!("=== TypeScript Engine Test Output ===");
                println!("{}", output);
                println!("=== End Output ===");

                // Verify the output contains expected private and public keys
                assert!(
                    output.contains("Private key:"),
                    "Output should contain 'Private key:', got: {}",
                    output
                );
                assert!(
                    output.contains("Public key :"),
                    "Output should contain 'Public key :', got: {}",
                    output
                );
                assert!(
                    output.contains("5KAffU3Pw7RNJAJ3d1qUrJ6QPVb6UFx6CJ4MhgfoHL7YwYspHhs"),
                    "Output should contain expected private key, got: {}",
                    output
                );
                assert!(
                    output.contains("GPH8mT7XvtTARjdZQ9bqHRoJRMf7P7azFqTQACckaVenM2GmJyxLh"),
                    "Output should contain expected public key, got: {}",
                    output
                );

                // Verify it appears twice (as main.ts calls genkey() twice)
                let private_key_count = output.matches("Private key:").count();
                let public_key_count = output.matches("Public key :").count();
                assert_eq!(
                    private_key_count, 2,
                    "Should have 2 private key outputs, got: {}",
                    private_key_count
                );
                assert_eq!(
                    public_key_count, 2,
                    "Should have 2 public key outputs, got: {}",
                    public_key_count
                );
            }
            Err(e) => {
                panic!("Failed to execute main.ts: {:?}", e);
            }
        }
    }

    #[tokio::test]
    async fn test_console_output_format() {
        let mut engine = TypeScriptEngine::new().expect("Failed to create engine");
        let result = engine.execute_main_ts();

        match result {
            Ok(output) => {
                println!("=== Console Output Format Test ===");
                println!("{}", output);
                println!("=== End Format Test ===");

                // Verify output format matches expected pattern
                let lines: Vec<&str> = output.lines().collect();
                let non_empty_lines: Vec<&str> = lines
                    .iter()
                    .filter(|line| !line.trim().is_empty())
                    .cloned()
                    .collect();

                // Should have at least 4 non-empty lines (2 private + 2 public key lines)
                assert!(
                    non_empty_lines.len() >= 4,
                    "Should have at least 4 output lines, got: {} lines: {:?}",
                    non_empty_lines.len(),
                    non_empty_lines
                );

                // Verify the format matches expected output
                let expected_private =
                    "Private key: 5KAffU3Pw7RNJAJ3d1qUrJ6QPVb6UFx6CJ4MhgfoHL7YwYspHhs";
                let expected_public =
                    "Public key : GPH8mT7XvtTARjdZQ9bqHRoJRMf7P7azFqTQACckaVenM2GmJyxLh";

                assert!(
                    output.contains(expected_private),
                    "Output should contain exact private key format"
                );
                assert!(
                    output.contains(expected_public),
                    "Output should contain exact public key format"
                );
            }
            Err(e) => {
                panic!("Failed to execute main.ts for format test: {:?}", e);
            }
        }
    }

    #[tokio::test]
    async fn test_simple_ts_to_js_conversion() {
        let engine = TypeScriptEngine::new().expect("Failed to create engine");
        let ts_code = r#"
            import * as rsq from "rsquared-js";
            export function add(a: number, b: number): number {
                return a + b;
            }
        "#;

        let js_code = engine.simple_ts_to_js(ts_code);
        assert!(
            js_code.contains("const rsq = globalThis.rsquaredJs;"),
            "Should replace import statement"
        );
        assert!(
            !js_code.contains(": number"),
            "Should remove TypeScript type annotations"
        );
        assert!(
            js_code.contains("function add"),
            "Should preserve function declaration"
        );
    }
}
