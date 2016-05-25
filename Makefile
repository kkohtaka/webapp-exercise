# Copyright 2016, Z Lab Corporation. All rights reserved.

USER?=kkohtaka
PRODUCT?=webapp-exercise

IMAGE_NAME=$(USER)/$(PRODUCT)

.PHONY: build push

all: build

build:
	docker build -t $(IMAGE_NAME) .

push:
	docker push $(IMAGE_NAME)
