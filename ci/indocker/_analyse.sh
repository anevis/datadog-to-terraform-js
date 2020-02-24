#!/usr/bin/env bash
set -euo pipefail

echo "Analyse"
yarn analyse -Dsonar.login="${SONARCLOUD_TOKEN}" -Dsonar.branch.name="${GIT_BRANCH}"
