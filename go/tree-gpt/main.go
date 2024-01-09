// Package main is the core package for the Tree GPT tool.
// It provides various utilities for working with file trees.package main
package main

import (
	"fmt"
	"strings"
)

// main method
func main() {
	opts := ParseFlags()

	if err := checkMacOs(); err != nil {
		fmt.Println("treeGPT: ", err)
		return
	}

	if err := CheckTreeCmd(); err != nil {
		fmt.Println("treeGPT: ", err)
		return
	}

	// Grab tree cmd stdout
	treeCmdResult, err := TreeCmd()
	if err != nil {
		fmt.Println("treeGPT: ", err)
		return
	}

	// Grab all files nested in this dir
	fileCmdResult, err := FileCmd()
	if err != nil {
		fmt.Println("treeGPT: ", err)
		return
	}

	// Put them together
	var resultBuilder strings.Builder

	resultBuilder.WriteString("My current path is " + CurrentWorkingDirPath())
	resultBuilder.WriteString("\nHere's what my current directory looks like (from the tree cmd): \n\n")
	resultBuilder.WriteString(treeCmdResult)
	resultBuilder.WriteString("\nHere's each file:")
	resultBuilder.WriteString(fileCmdResult)

	result := resultBuilder.String()

	if opts.PrintToTerminal {
		fmt.Println(result)
	}

	CopyToClipboard(result)
}
