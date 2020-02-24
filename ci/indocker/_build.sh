#!/usr/bin/env bash
set -euo pipefail

echo "Build the production artifact"

yarn build -p
