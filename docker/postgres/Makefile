# Copyright 2016, Z Lab Corporation. All rights reserved.

USER?=kkohtaka
PRODUCT?=postgres-webapp-exercise

IMAGE_NAME=$(USER)/$(PRODUCT)

.PHONY: build push

all: push

build:
	docker build -t $(IMAGE_NAME) .

push: build
	docker push $(IMAGE_NAME)
