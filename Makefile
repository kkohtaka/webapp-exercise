# Copyright 2016, Z Lab Corporation. All rights reserved.

USER?=kkohtaka
PRODUCT?=webapp-exercise

IMAGE_NAME=$(USER)/$(PRODUCT)

.PHONY: build push

all: push

build:
	docker build -t $(IMAGE_NAME) .
	make -C docker/postgres build

push: build
	docker push $(IMAGE_NAME)
	make -C docker/postgres push
