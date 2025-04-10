include ../../definitions.mk
DISTFILES := $(addprefix ../../../,$(shell grep -v '^\#' .distfiles))
ROOT_DIR := $(abspath ../../../)
VENDOR := staging
BRANCH := $(shell echo `git symbolic-ref --short HEAD`)
COMMIT := $(shell echo `git rev-parse --short HEAD`)

dist.tgz: $(DISTFILES)
	docker run --rm -w $(CURDIR) -v $(ROOT_DIR):$(ROOT_DIR) busybox:1.29-uclibc tar -czf $@ $^

.PHONY: clean-dist.tgz
clean-dist.tgz:
	rm -f dist.tgz

.PHONY: version
version:
	@echo '{ "version": "$(VERSION)", "branch": "$(BRANCH)", "commit": "$(COMMIT)", "created_at": "'`date '+%Y-%m-%d %H:%M:%S'`'" }' > $(ROOT_DIR)/apps/web/version.json

$(BUILD_IMAGE): clean-dist.tgz version dist.tgz