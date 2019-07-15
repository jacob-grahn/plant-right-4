#!/usr/bin/env bash

set -e

packages="client pr2-level-importer"

for package in $packages; do
  cd $package
  npm install
  npm run lint
  npm run test
  cd ../
done