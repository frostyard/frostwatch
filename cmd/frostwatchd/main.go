// Command frostwatchd reserves the daemon name. It serves no endpoint yet.
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/frostyard/frostwatch/internal/rpc"
)

func run(ctx context.Context) error { return rpc.Unimplemented(ctx) }

func main() {
	if err := run(context.Background()); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
