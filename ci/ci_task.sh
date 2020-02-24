#!/usr/bin/env bash

source "$(dirname "$(readlink "$0")")/ci/shared/_docker_helper.sh"

if [[ -n "${TRAVIS_BRANCH:-}" ]];
then
    export GIT_BRANCH="${TRAVIS_BRANCH}"
elif [[ -z "${GIT_BRANCH:-}" ]];
then
    export GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

export BUILD_DIR="$(pwd)/build"

echo "Travis Branch=${TRAVIS_BRANCH}"
echo "Git Branch=${GIT_BRANCH}"
echo "Build Directory=${BUILD_DIR}"

mkdir -p "${BUILD_DIR}"

run_in_docker
