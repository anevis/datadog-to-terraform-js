#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]
then
    CI_TASK="help"
else
    CI_TASK=$1
fi

export CI_TASK

[[ ${CI_TASK} =~ [^[:alnum:]_-] ]] && { echo "bad param" >&2; exit 1; }
"$(dirname "$(readlink "$0")")/ci/${CI_TASK}.sh"
