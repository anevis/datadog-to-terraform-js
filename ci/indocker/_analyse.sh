#!/usr/bin/env bash
set -euo pipefail

echo "Analyse"

echo "${BLOCK_START_PREFIX}Audit"
yarn audit-ci
echo "${BLOCK_END_PREFIX}Audit"

echo "${BLOCK_START_PREFIX}Analysis"
echo "${BLOCK_START_PREFIX}Test Coverage"
yarn test-ci --coverage
echo "${BLOCK_END_PREFIX}Test Coverage"

echo "${BLOCK_START_PREFIX}SonarCloud"
if [[ "${GIT_PULL_REQUEST}" = "false" ]];
then
  yarn analyse -Dsonar.login="${SONARCLOUD_TOKEN}" -Dsonar.branch.name="${GIT_BRANCH}"
else
  yarn analyse -Dsonar.login="${SONARCLOUD_TOKEN}" -Dsonar.pullrequest.branch="${GIT_BRANCH}" -Dsonar.pullrequest.key="${GIT_PULL_REQUEST}" -Dsonar.pullrequest.base=master
fi
echo "${BLOCK_END_PREFIX}SonarCloud"
echo "${BLOCK_END_PREFIX}Analysis"
