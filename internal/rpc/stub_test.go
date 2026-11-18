package rpc_test

import (
	"testing"

	"connectrpc.com/connect"
	"github.com/frostyard/frostwatch/internal/rpc"
)

func TestSkeletonHandler(t *testing.T) {
	if err := rpc.Unimplemented(t.Context()); connect.CodeOf(err) != connect.CodeUnimplemented {
		t.Fatalf("code = %s, want unimplemented", connect.CodeOf(err))
	}
}
