#!/bin/zsh
# Wave 4 (overnight): base4 (= checkpoint 1) + b1..b4 patches + lead_fixes2.py
cd ~/Desktop/21-254/agents
rm -rf merged && rsync -a base4/ merged/
for p in b1 b2 b3 b4; do [ -s $p.patch ] || { echo "$p: no patch"; continue; }
  if patch -p1 -d merged --forward -s < $p.patch > $p.apply.log 2>&1; then echo "$p: applied"; else echo "$p: PROBLEMS"; tail -4 $p.apply.log; fi; done
python3 lead_fixes2.py; find merged -name "*.orig" -delete
