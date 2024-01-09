use clap::{ArgAction, Parser};

#[derive(Parser)]
pub struct Args {
    /// Print to the console in addition to saving to clipboard
    #[arg(short, long, action = ArgAction::SetTrue)]
    print: bool,
}

pub fn parse_args() -> Args {
    Args::parse()
}
