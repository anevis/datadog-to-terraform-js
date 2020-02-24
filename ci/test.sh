#!/usr/bin/env bash
# This task runs unit tests and coverage
set -euo pipefail

"$(dirname "$(readlink "$0")")/ci/ci_task.sh"
