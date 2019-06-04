export GO111MODULE=on

GO := go
LDFLAGS := -s -w

all: build/server

build/server:
	$(GO) build -ldflags '$(LDFLAGS)' -o $@ ./cmd/server

.PHONY: mod
mod:
	$(GO) mod tidy
	$(GO) mod verify
