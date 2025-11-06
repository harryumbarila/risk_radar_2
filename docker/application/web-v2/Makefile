include ../../definitions.mk

ROOT_DIR := $(abspath ../../../)
VENDOR := staging
BRANCH := $(shell echo `git symbolic-ref --short HEAD`)
COMMIT := $(shell echo `git rev-parse --short HEAD`)
DOCKERFILE := $(ROOT_DIR)/docker/application/web-v2/Dockerfile

.PHONY: version
version:
	@echo '{ "version": "$(VERSION)", "branch": "$(BRANCH)", "commit": "$(COMMIT)", "created_at": "'`date '+%Y-%m-%d %H:%M:%S'`'" }' > $(ROOT_DIR)/apps/web-v2/version.json

$(BUILD_IMAGE): version
