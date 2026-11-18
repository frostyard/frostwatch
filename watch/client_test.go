package watch_test

import (
	"context"
	"reflect"
	"slices"
	"testing"

	"connectrpc.com/connect"
	"github.com/frostyard/frostwatch/watch"
)

func TestExactMethodSet(t *testing.T) {
	want := []string{
		"AcknowledgeAlert",
		"GetAlert",
		"GetResource",
		"GetSourceStatus",
		"ListAlerts",
		"ListResources",
		"QueryMetric",
	}
	for _, typ := range []reflect.Type{reflect.TypeFor[watch.Client](), reflect.TypeFor[*watch.Client]()} {
		var got []string
		for i := range typ.NumMethod() {
			got = append(got, typ.Method(i).Name)
		}
		if !slices.Equal(got, want) {
			t.Errorf("%s methods = %v, want exactly %v", typ, got, want)
		}
	}
}

func TestEveryStubIsUnimplemented(t *testing.T) {
	client := watch.Client{}
	methods := map[string]func(context.Context) error{
		"ListResources":    client.ListResources,
		"GetResource":      client.GetResource,
		"QueryMetric":      client.QueryMetric,
		"ListAlerts":       client.ListAlerts,
		"GetAlert":         client.GetAlert,
		"GetSourceStatus":  client.GetSourceStatus,
		"AcknowledgeAlert": client.AcknowledgeAlert,
	}
	for name, method := range methods {
		t.Run(name, func(t *testing.T) {
			for _, canceled := range []bool{false, true} {
				ctx, cancel := context.WithCancel(t.Context())
				if canceled {
					cancel()
				}
				err := method(ctx)
				cancel()
				if connect.CodeOf(err) != connect.CodeUnimplemented {
					t.Fatalf("code = %s, want unimplemented", connect.CodeOf(err))
				}
			}
		})
	}
}
