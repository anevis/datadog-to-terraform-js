#!/usr/bin/env bash
# This task deploys the package to GitHub pages
set -euo pipefail

"$(dirname "$(readlink "$0")")/ci/ci_task.sh"
