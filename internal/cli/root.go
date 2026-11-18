// Package cli defines watchctl's thin command shell over the watch SDK.
package cli

import (
	"github.com/frostyard/frostwatch/watch"
	"github.com/spf13/cobra"
)

// New returns a fresh root command with no runtime flags or backend access.
func New() *cobra.Command {
	return &cobra.Command{
		Use:   "watchctl",
		Short: "Frostwatch CLI skeleton (not implemented)",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, _ []string) error {
			return (watch.Client{}).GetSourceStatus(cmd.Context())
		},
	}
}
