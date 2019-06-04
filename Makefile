export GO111MODULE=off

GO := go
LDFLAGS := -s -w

BUILD_PATH := $(shell pwd)/build
BUILD_BIN_PATH := $(BUILD_PATH)/bin

GOLANGCI_LINT := $(BUILD_BIN_PATH)/golangci-lint

all: build/bin/server

build/bin/server:
	$(GO) build -ldflags '$(LDFLAGS)' -o $@ ./cmd/server

define go-build
	$(shell cd `pwd` && $(GO) build -o $(BUILD_BIN_PATH)/$(1) $(2))
endef

clean:
	git clean -fdx

$(GOLANGCI_LINT):
	$(call go-build,golangci-lint,./vendor/github.com/golangci/golangci-lint/cmd/golangci-lint)

.PHONY: lint
lint: $(GOLANGCI_LINT)
	$(GOLANGCI_LINT) run

.PHONY: vendor
vendor:
	export GO111MODULE=on \
		$(GO) mod tidy && \
		$(GO) mod vendor && \
		$(GO) mod verify
