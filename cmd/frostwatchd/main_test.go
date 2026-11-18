package main

import (
	"testing"

	"connectrpc.com/connect"
)

func TestDaemonDoesNotStart(t *testing.T) {
	if err := run(t.Context()); connect.CodeOf(err) != connect.CodeUnimplemented {
		t.Fatalf("code = %s, want unimplemented", connect.CodeOf(err))
	}
}
