#!/usr/bin/env bash

source "$(dirname "$(readlink "$0")")/ci/shared/_docker_helper.sh"

if [[ -n "${TRAVIS_BRANCH:-}" ]];
then
    export GIT_BRANCH="${TRAVIS_BRANCH}"
elif [[ -z "${GIT_BRANCH:-}" ]];
then
    export GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

if [[ -n "${TRAVIS_BUILD_DIR:-}" ]];
then
    export WORK_DIR="${TRAVIS_BUILD_DIR}"
elif [[ -z "${WORK_DIR:-}" ]];
then
    export WORK_DIR=$(pwd)
fi

export BUILD_DIR="${WORK_DIR}/build"

echo "Travis Branch=${TRAVIS_BRANCH}"
echo "Git Branch=${GIT_BRANCH}"
echo "Build Directory=${BUILD_DIR}"

mkdir -p "${BUILD_DIR}"

run_in_docker
