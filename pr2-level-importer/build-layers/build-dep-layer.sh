#!/bin/bash
mkdir -p ../layers

docker build \
    --tag build-dep-layer \
    --file build-dep-layer.dockerfile \
    ../

docker run \
    --rm \
    --name build-dep-layer \
    --volume $PWD/../layers:/layers \
    build-dep-layer cp /root/node_modules.zip /layers