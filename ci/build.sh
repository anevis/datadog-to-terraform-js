#!/usr/bin/env bash
# This task will  build and publish (only for master) the artifact
set -euo pipefail

"$(dirname "$(readlink "$0")")/ci/ci_task.sh"
