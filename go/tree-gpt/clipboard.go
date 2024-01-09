package main

import (
	"bytes"
	"golang.design/x/clipboard"
	"os/exec"
)

func CopyToClipboard(str string) error {
	if err := clipboard.Init(); err != nil {
		panic(err)
	}

	clipboard.Write(clipboard.FmtText, []byte(str))
	return nil
}

func CopyToClipboardMac(str string) error {
	cmd := exec.Command("pbcopy", str)
	cmd.Stdin = bytes.NewBufferString(str)
	return cmd.Run()
}
