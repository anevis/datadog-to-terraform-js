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

echo "${BLOCK_START_PREFIX}DockerAuthentication"
echo "Download docker-credential-pass"
curl -fsSL https://github.com/docker/docker-credential-helpers/releases/download/v0.6.3/docker-credential-pass-v0.6.3-amd64.tar.gz | tar xz
export PATH=$PATH:$(pwd)
chmod + docker-credential-pass

echo "Create docker config"
config_path=~/.docker
config_filename=$config_path/config.json

if [ ! -f $config_filename ]
then
    if [ ! -d $config_path ]
    then
        mkdir -p $config_path
    fi

    # Create default docker config file if it doesn't exist (never logged in etc.). Empty is fine currently.
    cat > $config_filename <<EOL
{
}
EOL
    echo "$config_filename created with defaults"
else
    echo "$config_filename already exists"
fi

# Whether config is new or existing, read into variable for easier file redirection (cat > truncate timing)
config_json=$(cat $config_filename)

if [ -z "$config_json" ]; then
    # Empty file will prevent jq from working
    config_json="{}"
fi

# Update Docker config to set the credential store. Used sed before but messy / edge cases.
echo "$config_json" | jq --arg credsStore pass '. + {credsStore: $credsStore}' > $config_filename

echo "Init key for pass"
gpg --batch --gen-key <<-EOF
%echo Generating a standard key
Key-Type: DSA
Key-Length: 1024
Subkey-Type: ELG-E
Subkey-Length: 1024
Name-Real: Anevis [travis-ci]
Name-Email: anevis@travis-ci
Expire-Date: 0
# Do a commit here, so that we can later print "done" :-)
%commit
%echo done
EOF

key=$(gpg --no-auto-check-trustdb --list-secret-keys | grep ^sec | cut -d/ -f2 | cut -d" " -f1)
pass init "$key"

echo "Leave this password blank (important):"
pass insert docker-credential-helpers/docker-pass-initialized-check

echo "Login to Docker"
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

echo "${BLOCK_END_PREFIX}DockerAuthentication"

./ci.sh "$@"
