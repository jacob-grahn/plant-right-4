#!/bin/bash
mkdir -p ../layers

docker build \
    --tag build-bin-layer \
    --file build-bin-layer.dockerfile \
    ../

docker run \
    --rm \
    --name build-bin-layer \
    --volume $PWD/../layers:/layers \
    build-bin-layer cp /root/bin.zip /layers