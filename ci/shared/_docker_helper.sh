#!/usr/bin/env bash

set -euo pipefail

export BUILD_DOCKER_IMAGE_NAME="anevis/datadog-to-terraform-js"
: ${IMAGE_BUILT=No}

function build_buildimage() {
    echo "Building image ${BUILD_DOCKER_IMAGE_NAME}"
    docker build -t "${BUILD_DOCKER_IMAGE_NAME}" .
}

function run_in_docker() {
    if [[ "${IMAGE_BUILT}" == "No" ]]; then
        build_buildimage
        export IMAGE_BUILT="Yes"
    fi

    echo "CI Task=${CI_TASK}"
    docker run -e GIT_BRANCH="${GIT_BRANCH}" -e SONARCLOUD_TOKEN="${SONARCLOUD_TOKEN}" \
        -v "${BUILD_DIR}":/root/app/build -v "${WORK_DIR}/.git":/root/app/.git \
        "${BUILD_DOCKER_IMAGE_NAME}" "./ci/indocker/_${CI_TASK}.sh"
}
