# Copyright 2016, Z Lab Corporation. All rights reserved.

PRODUCT?=webapp-exercise

IMAGE_NAME=$(PRODUCT)

.PHONY: build

build:
	docker build -t $(IMAGE_NAME) .
