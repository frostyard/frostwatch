package cli_test

import (
	"io"
	"testing"

	"connectrpc.com/connect"
	"github.com/frostyard/frostwatch/internal/cli"
)

func TestRootIsUnimplemented(t *testing.T) {
	cmd := cli.New()
	cmd.SetOut(io.Discard)
	cmd.SetErr(io.Discard)
	cmd.SetArgs([]string{})
	if err := cmd.ExecuteContext(t.Context()); connect.CodeOf(err) != connect.CodeUnimplemented {
		t.Fatalf("code = %s, want unimplemented", connect.CodeOf(err))
	}
}

func TestHelpIsAvailable(t *testing.T) {
	cmd := cli.New()
	cmd.SetOut(io.Discard)
	cmd.SetArgs([]string{"--help"})
	if err := cmd.ExecuteContext(t.Context()); err != nil {
		t.Fatal(err)
	}
}
