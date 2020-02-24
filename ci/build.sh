#!/usr/bin/env bash
# This task will build and publish the artifact
set -euo pipefail

"$(dirname "$(readlink "$0")")/ci/ci_task.sh"
