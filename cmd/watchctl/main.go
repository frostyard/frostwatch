// Command watchctl is the unavailable Frostwatch CLI skeleton.
package main

import (
	"os"

	"github.com/frostyard/clix"
	"github.com/frostyard/frostwatch/internal/cli"
)

var (
	version = "dev"
	commit  = "none"
	date    = "unknown"
	builtBy = "local"
)

func main() {
	app := clix.App{Version: version, Commit: commit, Date: date, BuiltBy: builtBy}
	if err := app.Run(cli.New()); err != nil {
		os.Exit(1)
	}
}
