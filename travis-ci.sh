#!/usr/bin/env bash
set -euo pipefail

if [[ -n "${TRAVIS_PULL_REQUEST:-}" ]];
then
    export GIT_PULL_REQUEST="${TRAVIS_PULL_REQUEST}"
fi

if [[ "${TRAVIS_PULL_REQUEST}" != "false" ]];
then
    export GIT_BRANCH="${TRAVIS_PULL_REQUEST_BRANCH}"
elif [[ -n "${TRAVIS_BRANCH:-}" ]];
then
    export GIT_BRANCH="${TRAVIS_BRANCH}"
fi

if [[ -n "${TRAVIS_BUILD_DIR:-}" ]];
then
    export WORK_DIR="${TRAVIS_BUILD_DIR}"
fi

export BLOCK_START_PREFIX="travis_fold:start:"
export BLOCK_END_PREFIX="travis_fold:end:"

echo "Travis Branch=${TRAVIS_BRANCH}"
echo "Travis Pull Request=${TRAVIS_PULL_REQUEST}"
echo "Travis Build Directory=${TRAVIS_BUILD_DIR}"

echo "Docker authentication"
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

./ci.sh "$@"
