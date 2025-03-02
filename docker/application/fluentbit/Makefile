include ../../definitions.mk
DISTFILES := $(addprefix ../../../,$(shell grep -v '^\#' .distfiles))
ROOT_DIR := $(abspath ../../../)
VENDOR :=
ifndef REGISTRY
REGISTRY := $(or $(ECR_ROOT), 257498453293.dkr.ecr.us-west-2.amazonaws.com)
endif
FLUENT_REPOSITORY := $(or $(FLUENT_IMAGE_REPOSITORY), $(notdir $(CURDIR)))


$(BUILD_IMAGE):
	docker build --build-arg BUILD_DATE=$(BUILD_DATE) --build-arg VERSION=$(VERSION) --build-arg GITHASH=$(GITHASH) -t $(call internal_image_name) .
	docker tag $(call internal_image_name) $(call image_name)
	docker tag $(call image_name) $(REGISTRY)/$(FLUENT_REPOSITORY):$(VERSION)
	docker tag $(call image_name) $(REGISTRY)/$(FLUENT_REPOSITORY):latest
