#!/usr/bin/env bash
set -euo pipefail

echo "${BLOCK_START_PREFIX}Formatting.and.Linting"
yarn format-check lint
echo "${BLOCK_END_PREFIX}Formatting.and.Linting"

echo "${BLOCK_START_PREFIX}Unit.Tests.and.Coverage"
yarn test-ci --coverage
echo "${BLOCK_END_PREFIX}Unit.Tests.and.Coverage"
