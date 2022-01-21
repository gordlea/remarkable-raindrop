#!/usr/bin/env sh
# https://blog.thesparktree.com/cron-in-docker

# YARN="$(which yarn)"

RUN_CMD="/docker_run.sh"

env >> /etc/environment

# set cron from RMKDROP_CRON (default to every 10 minutes)
DEQUOTED_CRON="${RMKDROP_CRON%\"}"
DEQUOTED_CRON="${DEQUOTED_CRON#\"}"
echo "${DEQUOTED_CRON:-*/10 * * * *} ${RUN_CMD}" | crontab - 

# # run command once at startup
$RUN_CMD

# run CMD (default is to run cron)
exec "$@"