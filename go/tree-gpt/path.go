package main

import (
	"fmt"
	"os"
	"path/filepath"
)

func ExecutablePath() string {
	ex, err := os.Executable()
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	return filepath.Dir(ex)
}

func CurrentWorkingDirPath() string {
	wd, err := os.Getwd()
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	return wd
}
