#![allow(dead_code)]
//! This module runs the tree_gpt command
//! It will grab the current writing directory,
//! the tree command output and the file content for each file in the tree output

mod cli;
mod commands;
pub mod config;
mod utils;
// mod check;
// mod clipboard;
// mod file_cmd;
// mod config;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = config::Config::new()?;

    let file_cmd_result = commands::file_cmd(&config);
    let args = cli::parse_args();

    Ok(())
}
