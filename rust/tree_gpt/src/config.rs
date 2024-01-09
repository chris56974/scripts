use serde::Deserialize;
use std::collections::HashMap;

#[derive(Deserialize)]
struct RawConfig {
    ignore: RawIgnore,
}

#[derive(Deserialize)]
struct RawIgnore {
    files: Vec<String>,
    file_extensions: Vec<String>,
    folders: Vec<String>,
}

pub struct Config {
    pub ignore: Ignore,
}

pub struct Ignore {
    pub files: HashMap<String, bool>,
    pub file_extensions: HashMap<String, bool>,
    pub folders: HashMap<String, bool>,
}

impl Config {
    pub fn new() -> Result<Self, serde_json::Error> {
        let config_str = include_str!("../config/config.json");
        let raw_config: RawConfig = serde_json::from_str(&config_str)?;
        Ok(Config {
            ignore: Ignore {
                files: raw_config
                    .ignore
                    .files
                    .into_iter()
                    .map(|f| (f, true))
                    .collect(),
                file_extensions: raw_config
                    .ignore
                    .file_extensions
                    .into_iter()
                    .map(|f| (f, true))
                    .collect(),
                folders: raw_config
                    .ignore
                    .folders
                    .into_iter()
                    .map(|f| (f, true))
                    .collect(),
            },
        })
    }
}
