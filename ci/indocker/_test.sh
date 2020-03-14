#!/usr/bin/env bash
set -euo pipefail

echo "${BLOCK_START_PREFIX}Formatting & Linting checks"
yarn format-check lint
echo "${BLOCK_END_PREFIX}Formatting & Linting checks"

echo "${BLOCK_START_PREFIX}Running Unit Tests and Coverage"
yarn test-ci --coverage
echo "${BLOCK_END_PREFIX}Running Unit Tests and Coverage"
