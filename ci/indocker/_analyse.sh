#!/usr/bin/env bash
set -euo pipefail

echo "Analyse"

echo "${BLOCK_START_PREFIX}Audit"
yarn audit-ci
echo "${BLOCK_END_PREFIX}Audit"

echo "${BLOCK_START_PREFIX}Test.Coverage.and.SonarCloud"
yarn test-ci --coverage

if [[ "${GIT_PULL_REQUEST}" = "false" ]];
then
  yarn analyse -Dsonar.login="${SONARCLOUD_TOKEN}" -Dsonar.branch.name="${GIT_BRANCH}"
else
  yarn analyse -Dsonar.login="${SONARCLOUD_TOKEN}" -Dsonar.pullrequest.branch="${GIT_BRANCH}" -Dsonar.pullrequest.key="${GIT_PULL_REQUEST}" -Dsonar.pullrequest.base=main
fi
echo "${BLOCK_END_PREFIX}Test.Coverage.and.SonarCloud"
