#!/usr/bin/env bash

source "$(dirname "$(readlink "$0")")/ci/shared/_docker_helper.sh"

if [[ -z "${GIT_BRANCH:-}" ]];
then
    export GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

if [[ -z "${GIT_PULL_REQUEST:-}" ]];
then
    export GIT_PULL_REQUEST="false"
fi

if [[ -z "${WORK_DIR:-}" ]];
then
    export WORK_DIR=$(pwd)
fi

export BUILD_DIR="${WORK_DIR}/build"

echo "Git Branch=${GIT_BRANCH}"
echo "Git Pull Request=${GIT_PULL_REQUEST}"
echo "Build Directory=${BUILD_DIR}"

mkdir -p "${BUILD_DIR}"

run_in_docker
