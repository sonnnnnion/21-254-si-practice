#!/bin/zsh
# Wave 6 (2026-11-03): base6 (= live 36ea9ad + registered ids + placeholders) + e1..e4 patches, then strip the scaffolding
cd ~/Desktop/21-254/agents
rm -rf merged && rsync -a base6/ merged/
for p in e1 e2 e3 e4; do [ -s $p.patch ] || { echo "$p: no patch"; continue; }
  if patch -p1 -d merged --forward -s < $p.patch > $p.apply.log 2>&1; then echo "$p: applied"; else echo "$p: PROBLEMS"; tail -4 $p.apply.log; fi; done
find merged -name "*.orig" -delete
python3 -I ~/Desktop/21-254/repo/_dev/agents/strip6.py
python3 -I ~/Desktop/21-254/repo/_dev/agents/lead_fixes6.py
