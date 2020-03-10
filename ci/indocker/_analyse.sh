#!/usr/bin/env bash
set -euo pipefail

echo "Analyse"

echo "Audit"
yarn audit-ci

echo "SonarCloud"
yarn test-ci --coverage
yarn analyse -Dsonar.login="${SONARCLOUD_TOKEN}" -Dsonar.branch.name="${GIT_BRANCH}"
