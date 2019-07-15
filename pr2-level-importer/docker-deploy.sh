#!/bin/bash
set -e

docker build . -t amazon-canvas
docker run --rm \
  -v $PWD/.serverless:/root/.serverless \
  -v ~/.aws:/root/.aws \
  -v $PWD/src:/root/src \
  amazon-canvas serverless deploy
