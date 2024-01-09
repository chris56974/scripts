use std::env;
use std::process::Command;

/// Just in case someone tries to compile this script for windows or something
pub fn check_mac_os() -> Result<(), String> {
    if env::consts::OS != "macos" {
        // String literals are &str types not strings
        // Strings are dynamically resizable, and take up more memory
        // Rust prefers &str for string literals because they take less memory
        // It's &str not str, because str's are dynamically sized and rust 
        // doesn't know how big my string literal will be, so it uses a ref 
        // which is always the same size
        return Err("This script only runs on MacOS currently".to_string());
    }
    Ok(())
}

fn check_tree_cmd() -> Result<(), Box<dyn std::error::Error>> {
    let output = Command::new("which").arg("tree").output()?;

    if output.status.success() {
        Ok(())
    } else {
        Err("tree command not found".into()) // converts into Box<dyn std::error::Error>
    }
}
