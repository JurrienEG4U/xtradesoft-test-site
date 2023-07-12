#!/bin/sh -l

set -euo pipefail

if [[ -z "$GITHUB_WORKSPACE" ]]; then
  echo "Set the GITHUB_WORKSPACE env variable."
  exit 1
fi

cd "${GITHUB_WORKSPACE}/src"

mkdir "${HOME}/.ssh"
echo "${INPUT_DEPLOY_KEY}" > "${HOME}/.ssh/id_rsa_deploy"
chmod 600 "${HOME}/.ssh/id_rsa_deploy"
ssh-keyscan -t rsa -p ${INPUT_DEPLOY_PORT} -H ${INPUT_DEPLOY_HOST} >> "${HOME}/.ssh/known_hosts"

rsync --version

sh -c "
rsync ${INPUT_RSYNC_ARGUMENTS} ${INPUT_RSYNC_EXTRA_ARGUMENTS} \
  -e 'ssh -i ${HOME}/.ssh/id_rsa_deploy -o UserKnownHostsFile=${HOME}/.ssh/known_hosts -p ${INPUT_DEPLOY_PORT}' \
  ${GITHUB_WORKSPACE}/src/ \
  ${INPUT_DEPLOY_USER}@${INPUT_DEPLOY_HOST}:${INPUT_DEPLOY_DEST}
"

exit 0
