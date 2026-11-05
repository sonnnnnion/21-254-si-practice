#!/bin/bash
# merged9 = base9 + h patches given as args; then strip agent markers; syntax check
set -e; cd ~/dev-21254/w9; rm -rf merged; cp -r base9 merged
for n in "$@"; do echo "== h$n"; sed "s#^\(---\|+++\) \(base9\|h$n\)/#\1 x/#" h$n.patch | patch -p1 -d merged --no-backup-if-mismatch -F3 || { echo "REJECT h$n"; ls merged/*.rej; exit 1; }; done
python3 - <<'PY'
import re,subprocess
p="merged/index.html"; s=open(p).read()
s=re.sub(r'[ \t]*/\* @@(AGENT|CSS)-H\d[^\n]*@@ \*/\n','',s)
s=re.sub(r'[ \t]*/\* wave-9 css spacer h\d \*/\n','',s)
assert '@@AGENT' not in s and '@@CSS-H' not in s, "marker left"
open(p,"w").write(s); print("merged", len(s))
bad=0
for m in re.finditer(r'<script(?![^>]*src)[^>]*>(.*?)</script>',s,re.S):
    open("/private/tmp/claude-501/lead/chk.js","w").write(m.group(1))
    r=subprocess.run(["node","--check","/private/tmp/claude-501/lead/chk.js"],capture_output=True,text=True)
    if r.returncode: bad+=1; print(r.stderr[:300])
print("syntax bad =",bad)
PY
