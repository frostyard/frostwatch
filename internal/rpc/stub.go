// Package rpc reserves the daemon adapter boundary. No wire protocol is defined.
package rpc

import (
	"context"
	"errors"

	"connectrpc.com/connect"
	"github.com/frostyard/hearth/connectserver"
)

// Unimplemented refuses every skeleton operation without opening a backend.
// The hearth adapter preserves the Connect code at the future server boundary.
func Unimplemented(context.Context) error {
	return connectserver.Error(connect.NewError(connect.CodeUnimplemented, errors.New("frostwatch is not implemented")))
}
