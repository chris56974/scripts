package main

import (
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

func FileCmd() (string, error) {
	config, err := GetConfig()
	if err != nil {
		return "", err
	}

	// Walk and grab all the files
	var result strings.Builder
	cwdPath := CurrentWorkingDirPath()

	err = filepath.WalkDir(cwdPath, func(path string, d fs.DirEntry, err error) error {

		// If the dir or file is on my ignore list
		if d.IsDir() && config.Ignore.Folders[d.Name()] {
			return filepath.SkipDir
		}

		if !d.IsDir() && config.Ignore.Files[d.Name()] {
			return nil
		}

		if !d.IsDir() {
			content, err := os.ReadFile(path)
			if err != nil {
				return err
			}

			// ignore executables
			info, err := d.Info()
			if err != nil {
				return err
			}

			if IsExecAny(info.Mode()) {
				return nil
			}

			// ignore files with certain extensions
			fileExtension := strings.ToLower(filepath.Ext(d.Name()))
			if config.Ignore.FileExtensions[fileExtension] {
				return nil
			}

			result.WriteString("\n\n" + d.Name() + "\n\n")
			result.WriteString("\"\"\"\n")
			result.Write(content)
			result.WriteString("\n\"\"\"")
		}

		return nil
	})

	if err != nil {
		return "", err
	}

	return result.String(), nil
}

func IsExecAny(mode os.FileMode) bool {
	return mode&0111 != 0
}
