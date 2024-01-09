package main

import (
	"fmt"
	"os/exec"
	"strings"
)

func TreeCmd() (string, error) {
	// Setup & run tree.cmd
	treeCmd := exec.Command("tree")
	var result strings.Builder
	treeCmd.Stdout = &result

	if err := treeCmd.Run(); err != nil {
		return "", err
	}

	return result.String(), nil
}

func installTree() error {
	if _, err := exec.LookPath("brew"); err != nil {
		return fmt.Errorf("homebrew not found, please install that first https://brew.sh/")
	}

	if err := exec.Command("brew", "install", "tree").Run(); err != nil {
		return fmt.Errorf("failed to install tree: %w", err)
	}

	fmt.Println("tree installed successfully.")
	return nil
}