#!/usr/bin/env bash

source "$(dirname "$(readlink "$0")")/ci/shared/_docker_helper.sh"

if [[ -n "${TRAVIS_BUILD_DIR:-}" ]];
then
    export WORK_DIR="${TRAVIS_BUILD_DIR}"
elif [[ -z "${WORK_DIR:-}" ]];
then
    export WORK_DIR=$(pwd)
fi

export BUILD_DIR="${WORK_DIR}/build"

echo "Travis Branch=${TRAVIS_BRANCH}"
echo "Build Directory=${BUILD_DIR}"

mkdir -p "${BUILD_DIR}"

run_in_docker
