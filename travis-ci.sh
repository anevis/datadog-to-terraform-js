#!/usr/bin/env bash
set -euo pipefail

if [[ -n "${TRAVIS_BRANCH:-}" ]];
then
    export GIT_BRANCH="${TRAVIS_BRANCH}"
fi

if [[ -n "${TRAVIS_PULL_REQUEST:-}" ]];
then
    export GIT_PULL_REQUEST="${TRAVIS_PULL_REQUEST}"
fi

if [[ -n "${TRAVIS_BUILD_DIR:-}" ]];
then
    export WORK_DIR="${TRAVIS_BUILD_DIR}"
fi

./ci.sh "$@"
