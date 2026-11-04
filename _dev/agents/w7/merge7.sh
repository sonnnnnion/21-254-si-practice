#!/bin/bash
# merge wave-7 patches onto base7 into ./merged; strip the CSS markers; node syntax check of inline scripts
set -e; cd ~/dev-21254/w7; rm -rf merged; cp -R base7 merged
for n in "$@"; do echo "== f$n"; sed "s#^\(---\|+++\) \(base7\|f$n\)/#\1 x/#" f$n.patch | patch -p1 -d merged -s --no-backup-if-mismatch; done
python3 - <<'PY'
import re, pathlib
p = pathlib.Path.home()/"dev-21254/w7/merged/index.html"; s = p.read_text()
s = re.sub(r"\n  /\* ---- wave-7 css spacer \d ---- \*/", "", s)
s = re.sub(r"\n  /\* @@CSS-F\d \(your CSS goes on the lines just below this one\) @@ \*/", "", s)
assert "wave-7" not in s and "@@CSS-F" not in s
p.write_text(s); print("merged", len(s))
PY
python3 - <<'PY'
import re, pathlib, subprocess, tempfile
s = (pathlib.Path.home()/"dev-21254/w7/merged/index.html").read_text()
for i, m in enumerate(re.finditer(r"<script(?![^>]*src)[^>]*>(.*?)</script>", s, re.S)):
    f = tempfile.NamedTemporaryFile("w", suffix=".js", delete=False); f.write(m.group(1)); f.close()
    r = subprocess.run(["node", "--check", f.name], capture_output=True, text=True)
    if r.returncode: print("SCRIPT", i, r.stderr[:600])
print("syntax checked")
PY
