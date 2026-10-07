#!/bin/zsh
# Wave 5 (midday 2026-10-07): base5 (= live 4643d29) + c1..c3 patches + lead_fixes3.py
cd ~/Desktop/21-254/agents
rm -rf merged && rsync -a base5/ merged/
for p in c1 c2 c3; do [ -s $p.patch ] || { echo "$p: no patch"; continue; }
  if patch -p1 -d merged --forward -s < $p.patch > $p.apply.log 2>&1; then echo "$p: applied"; else echo "$p: PROBLEMS"; tail -4 $p.apply.log; fi; done
python3 lead_fixes3.py; find merged -name "*.orig" -delete
