use crate::config;
use std::fs;
use std::io;
use std::path::Path;

pub fn file_cmd(config: &config::Config) -> Result<String, io::Error> {
    let cwd_path = std::env::current_dir()?;
    let mut result = String::new();

    // we're passing in a reference to a closure for cb
    visit_dirs(&cwd_path, &config, &mut result)?;

    Ok(result)
}

fn visit_dirs(dir: &Path, config: &config::Config, result: &mut String) -> io::Result<()> {
    if dir.is_dir() {
        for entry in fs::read_dir(dir)? {
            // entry is also a result type
            let entry = entry?;
            let path = entry.path();

            // &entry.file_name() returns an OsString because it may contain non UTF-8 characters
            // It's "to_string_lossy" because non UTF-8 characters will be replaced with �
            // to_string_lossy returns COW (clone on write) which can be borrowed or owned
            // into_owned makes it easy here
            if path.is_dir() {
                if config
                    .ignore
                    .folders
                    .contains_key(&entry.file_name().to_string_lossy().into_owned())
                {
                    continue;
                }
                visit_dirs(&path, config, result)?;
            } else {
                if config
                    .ignore
                    .files
                    .contains_key(&entry.file_name().to_string_lossy().into_owned())
                {
                    continue;
                }
                let file_extension = path
                    .extension()
                    // unwrap or return the default value for that type
                    .unwrap_or_default()
                    .to_string_lossy()
                    .to_lowercase();

                if config.ignore.file_extensions.contains_key(&file_extension) {
                    continue;
                }

                if let Ok(content) = fs::read_to_string(&path) {
                    result.push_str(&format!(
                        "\n\n{}\n\n\"\"\"\n{}\n\"\"\"",
                        entry.file_name().to_string_lossy(),
                        content
                    ));
                }
            }
        }
    }
    Ok(())
}
