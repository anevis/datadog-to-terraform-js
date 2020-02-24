#!/usr/bin/env bash
set -euo pipefail

echo "Formatting & Linting checks"
yarn format-check lint

echo "Running Unit Tests and Coverage"
yarn test-ci --coverage
