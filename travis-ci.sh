#!/usr/bin/env bash
set -euo pipefail

if [[ -n "${TRAVIS_PULL_REQUEST:-}" ]];
then
    export GIT_PULL_REQUEST="${TRAVIS_PULL_REQUEST}"
fi

if [[ "${TRAVIS_PULL_REQUEST}" != "false" ]];
then
    export GIT_BRANCH="${TRAVIS_PULL_REQUEST_BRANCH}"
elif [[ -n "${TRAVIS_BRANCH:-}" ]];
then
    export GIT_BRANCH="${TRAVIS_BRANCH}"
fi

if [[ -n "${TRAVIS_BUILD_DIR:-}" ]];
then
    export WORK_DIR="${TRAVIS_BUILD_DIR}"
fi

export BLOCK_START_PREFIX="travis_fold:start:"
export BLOCK_END_PREFIX="travis_fold:end:"

echo "Travis Branch=${TRAVIS_BRANCH}"
echo "Travis Pull Request=${TRAVIS_PULL_REQUEST}"
echo "Travis Build Directory=${TRAVIS_BUILD_DIR}"

echo "Docker authentication"
# init key for pass
gpg --batch --gen-key <<-EOF
%echo Generating a standard key
Key-Type: DSA
Key-Length: 1024
Subkey-Type: ELG-E
Subkey-Length: 1024
Name-Real: GHDL [travis-ci]
Name-Email: ghdl@travis-ci
Expire-Date: 0
# Do a commit here, so that we can later print "done" :-)
%commit
%echo done
EOF

key=$(gpg --no-auto-check-trustdb --list-secret-keys | grep ^sec | cut -d/ -f2 | cut -d" " -f1)
pass init $key

curl -fsSL https://github.com/docker/docker-credential-helpers/releases/download/v0.6.0/docker-credential-pass-v0.6.0-amd64.tar.gz | tar x
export PATH=$PATH:$(pwd)
chmod + docker-credential-pass

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

./ci.sh "$@"
