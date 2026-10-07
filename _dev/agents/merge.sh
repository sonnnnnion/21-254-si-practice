#!/bin/zsh
# Merge every agent's patch onto a fresh copy of base: wave 1 (a01-a10, made against base), then the
# base -> base2 delta (new tools group + placeholders), then wave 2 (a11-a20, made against base2).
cd ~/Desktop/21-254/agents
rm -rf merged && rsync -a base/ merged/
apply() { local p=$1; [ -s $p.patch ] || { echo "$p: no patch (or empty)"; return; }
  if patch -p1 -d merged --forward -s < $p.patch > $p.apply.log 2>&1; then echo "$p: applied ($(grep -c '^+++ ' $p.patch) files)"; else echo "$p: PROBLEMS (see $p.apply.log)"; tail -4 $p.apply.log; fi; }
for p in a01 a02 a03 a04 a05 a06 a07 a08 a09 a10; do apply $p; done
patch -p1 -d merged --forward -s < base2.delta.patch && echo "base2 delta: applied"
for p in a11 a12 a13 a14 a15 a16 a17 a18; do apply $p; done
for p in a21 a22 a23 a24 a25 a26; do apply $p; done
# tidy: drop the spacer lines and any placeholder no agent replaced
python3 - <<'PY'
import re
p='merged/index.html'; s=open(p).read()
s=re.sub(r'^// \(spacer \d+\.\d+\)\n', '', s, flags=re.M)
left=re.findall(r'^/\* @@AGENT-(\d+) PLACEHOLDER \(([\w-]+)\).*@@ \*/\n', s, flags=re.M)
s=re.sub(r'^/\* @@AGENT-\d+ PLACEHOLDER .*@@ \*/\n', '', s, flags=re.M)
for n,t in left: s=s.replace(f'"{t}", ','').replace(f', "{t}"','').replace(f'"{t}"','')
open(p,'w').write(s); print('placeholders not filled:', left)
PY
python3 lead_fixes.py; find merged -name "*.orig" -delete
