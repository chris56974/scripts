package main

import (
	"flag"
)

// CommandLineOptions holds the parsed command-line options
type CommandLineOptions struct {
	PrintToTerminal bool
}

// ParseFlags parses the command-line flags
func ParseFlags() CommandLineOptions {
	printFlag := flag.Bool("p", false, "Print output to terminal")
	flag.Parse()

	return CommandLineOptions{
		PrintToTerminal: *printFlag,
	}
}
