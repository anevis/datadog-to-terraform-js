#!/usr/bin/env bash
# This task runs SonarQube analyses on the code
set -euo pipefail

"$(dirname "$(readlink "$0")")/ci/ci_task.sh"
