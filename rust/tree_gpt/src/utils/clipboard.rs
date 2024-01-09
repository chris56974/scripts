extern crate clipboard;

use clipboard::ClipboardContext;
use clipboard::ClipboardProvider;

use std::process::Command;

// dyn is a keyword for creating trait objects (structs/enums that impl a trait)
// the trait in this case is std::error:Error, I couldn't pass it into Box directly
// because traits don't have a concrete size at compile time. Sometimes the trait object
// is referred to as a type (in this case error type). A type is a struct, enum or primitive (i32, etc).
// I needed a Box (a pointer to the heap) because I don't know how big the error type would be
// The error type (depending on what error instance shows up) could be two different structs
// The structs could store completely different error messages, for example.
// The clipboard package might return more error types than just IO errors, so I had to do this
// Result is an enum with two variants, Ok(T) and Err(E)
pub fn copy_to_clipboard(s: &str) -> Result<(), Box<dyn std::error::Error>> {
    // The question mark will return an error from this function if new() returns an error
    let mut ctx: ClipboardContext = ClipboardProvider::new()?;

    // Set contents requires ownership of whatever you pass in
    // to_owned() creates a copy of s and gives s ownership of that copy
    ctx.set_contents(s.to_owned())?;

    // () is unit type aka return nothin
    Ok(())
}

fn copy_to_clipboard_mac(text: &str) -> Result<(), std::io::Error> {
    let mut child = Command::new("pbcopy")
        .stdin(std::process::Stdio::piped())
        .spawn()?;

    use std::io::Write;
    write!(child.stdin.as_mut().unwrap(), "{}", text)?;
    child.wait()?;
    Ok(())
}
