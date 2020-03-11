#!/usr/bin/env bash
set -euo pipefail

echo "Analyse"

echo "Audit"
yarn audit-ci
