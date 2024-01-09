package main

import (
	"embed"
	"encoding/json"
)

//go:embed config/config.json
var configFile embed.FS

type Config struct {
	Ignore struct {
		Files          map[string]bool `json:"files"`
		FileExtensions map[string]bool `json:"fileExtensions"`
		Folders        map[string]bool `json:"folders"`
	} `json:"ignore"`
}

func GetConfig() (*Config, error) {
	file, err := configFile.ReadFile("config/config.json")
	if err != nil {
		return nil, err
	}

	var rawConfig struct {
		Ignore struct {
			Files          []string `json:"files"`
			FileExtensions []string `json:"fileExtensions"`
			Folders        []string `json:"folders"`
		} `json:"ignore"`
	}

	if err = json.Unmarshal(file, &rawConfig); err != nil {
		return nil, err
	}

	config := &Config{}
	config.Ignore.Files = make(map[string]bool)
	config.Ignore.FileExtensions = make(map[string]bool)
	config.Ignore.Folders = make(map[string]bool)

	// Convert lists to maps
	for _, f := range rawConfig.Ignore.Files {
		config.Ignore.Files[f] = true
	}
	for _, f := range rawConfig.Ignore.FileExtensions {
		config.Ignore.FileExtensions[f] = true
	}
	for _, f := range rawConfig.Ignore.Folders {
		config.Ignore.Folders[f] = true
	}

	return config, nil
}
