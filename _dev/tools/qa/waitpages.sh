#!/bin/zsh
# usage: waitpages.sh <short sha> [deploy clone dir]
REPO=${2:-/private/tmp/claude-501/-Users-michaelakrembockstaller-Desktop-21-254/618f58eb-a116-4297-b77c-90892080a3ba/scratchpad/repo}
for i in {1..60}; do
  st=$(gh api repos/sonnnnnion/21-254-si-practice/pages/builds/latest --jq '.status + " " + .commit[0:7]')
  [[ "$st" == "built $1" ]] && break
  sleep 10
done
echo "$st"
curl -s "https://sonnnnnion.github.io/21-254-si-practice/index.html?v=$(date +%s)" -o /tmp/live_index.html
cmp /tmp/live_index.html "$REPO/index.html" && echo LIVE-IDENTICAL
