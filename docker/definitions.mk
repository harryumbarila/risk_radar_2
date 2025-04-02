REGISTRY := 257498453293.dkr.ecr.us-west-2.amazonaws.com/denali
VENDOR := $(notdir $(abspath $(CURDIR)/..))
REPOSITORY := $(notdir $(CURDIR))
VERSION := snapshot
BUILD_DATE := $(shell date +'%Y-%m-%dT%H:%M:%SZ')
GITHASH := $(shell git rev-parse --short HEAD)
BUILD_IMAGE = build-image

default: build

.PHONY: build
build: $(BUILD_IMAGE)

$(BUILD_IMAGE):
	docker buildx build --platform linux/amd64 \
	  --build-arg BUILD_DATE=$(BUILD_DATE) \
	  --build-arg VERSION=$(VERSION) \
	  --build-arg GITHASH=$(GITHASH) \
	  --cache-from=type=registry,ref=$(call image_name_cache) \
	  --cache-to=type=registry,ref=$(call image_name_cache),mode=max \
	  --output=type=docker \
	  -t $(call internal_image_name) .

	docker tag $(call internal_image_name) $(call image_name)
	docker tag $(call image_name) $(call image_name_latest_version)

	# Production
	docker tag $(call internal_image_name) $(call image_name_no_vendor)
	docker tag $(call image_name_latest_version) $(call image_name_latest_version_no_vendor)

define internal_image_name
"en.hayes.app/$(if $(VENDOR),$(VENDOR)/)$(REPOSITORY):latest"
endef

define image_name
"$(if $(REGISTRY),$(REGISTRY)/)$(if $(VENDOR),$(VENDOR)/)$(REPOSITORY)$(if $(VERSION),:$(VERSION))"
endef

define image_name_no_vendor
"$(if $(REGISTRY),$(REGISTRY)/)$(REPOSITORY)$(if $(VERSION),:$(VERSION))"
endef

define image_name_latest_version
"$(if $(REGISTRY),$(REGISTRY)/)$(if $(VENDOR),$(VENDOR)/)$(REPOSITORY):latest"
endef

define image_name_latest_version_no_vendor
"$(if $(REGISTRY),$(REGISTRY)/)$(REPOSITORY):latest"
endef

define image_name_cache
"$(if $(REGISTRY),$(REGISTRY)/)$(if $(VENDOR),$(VENDOR)/)$(REPOSITORY):cache"
endef
