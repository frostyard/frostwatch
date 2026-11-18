// Package watch is the Frostwatch SDK skeleton. It has no working transport.
// The context-only methods are placeholders, not the future typed wire contract.
package watch

import (
	"context"

	"github.com/frostyard/frostwatch/internal/rpc"
)

// Client is an unavailable baseline client. Its zero value is ready to use.
// No method opens a socket, reads a file, or returns inventory or alert data.
// Protocol generation will replace these provisional method signatures.
type Client struct{}

// ListResources is not implemented.
func (Client) ListResources(ctx context.Context) error { return rpc.Unimplemented(ctx) }

// GetResource is not implemented.
func (Client) GetResource(ctx context.Context) error { return rpc.Unimplemented(ctx) }

// QueryMetric is not implemented.
func (Client) QueryMetric(ctx context.Context) error { return rpc.Unimplemented(ctx) }

// ListAlerts is not implemented.
func (Client) ListAlerts(ctx context.Context) error { return rpc.Unimplemented(ctx) }

// GetAlert is not implemented.
func (Client) GetAlert(ctx context.Context) error { return rpc.Unimplemented(ctx) }

// GetSourceStatus is not implemented.
func (Client) GetSourceStatus(ctx context.Context) error { return rpc.Unimplemented(ctx) }

// AcknowledgeAlert is not implemented. It is reserved for UI-only display state.
// It is not an Alertmanager silence, a recovery signal, or an agent operation.
func (Client) AcknowledgeAlert(ctx context.Context) error { return rpc.Unimplemented(ctx) }
