#!/usr/bin/env bash

set -e

packages="client level-importer-pr2"

for package in $packages; do
  cd $package
  npm install
  npm run lint
  npm run test
  cd ../
done