#!/bin/bash
# merge wave-8 patches onto base8 into ./merged; strip markers; node syntax check of inline scripts
set -e; cd ~/dev-21254/w8; rm -rf merged; cp -R base8 merged
for n in "$@"; do echo "== g$n"; sed "s#^\(---\|+++\) \(base8\|g$n\)/#\1 x/#" g$n.patch | patch -p1 -d merged -s --no-backup-if-mismatch || true
  if [ -f merged/index.html.rej ]; then python3 rejcheck.py merged/index.html.rej || exit 1; rm merged/index.html.rej; fi; done
python3 - <<'PY'
import re, pathlib
p = pathlib.Path.home()/"dev-21254/w8/merged/index.html"; s = p.read_text()
# registry: insert every wave-8 id after its anchor (agents' registry hunks collide on one line)
NEW = [("m-sketch","m-tangent",7),("m-greencheck","m-green",9),("m-divthm","m-stokes",10)]
for nid, anchor, sec in NEW:
    if f'id: "{nid}"' not in s: continue
    k = s.index('"Methods, step by step": ['); e = s.index("]", k); line = s[k:e]
    if f'"{nid}"' not in line:
        line = line.replace(f'"{anchor}"', f'"{anchor}", "{nid}"', 1); s = s[:k] + line + s[e:]
    k = s.index("const VZ_SECTION_OF = {"); e = s.index("\n", s.index("\n", k)+1)
    if f'"{nid}":' not in s[k:e]:
        s = s[:e] + f' "{nid}": {sec},' + s[e:]
s = re.sub(r"\n[ \t]*/\* ---- wave-8 (css )?spacer \w+ ---- \*/", "", s)
s = re.sub(r"\n[ \t]*/\* @@CSS-G\d \(your CSS goes on the lines just below this one\) @@ \*/", "", s)
s = re.sub(r"\n[ \t]*/\* @@AGENT-G\d PLACEHOLDER[^\n]*@@ \*/", "", s)
s = s.replace("@@AGENT-G", "wave-8 G").replace(" @@ */", " */")
assert "PLACEHOLDER" not in s and "wave-8 spacer" not in s and "@@CSS-G" not in s and "@@AGENT-G" not in s, "marker left"
p.write_text(s); print("merged", len(s))
PY
python3 - <<'PY'
import re, pathlib, subprocess, tempfile
s = (pathlib.Path.home()/"dev-21254/w8/merged/index.html").read_text()
bad = 0
for i, m in enumerate(re.finditer(r"<script(?![^>]*src)[^>]*>(.*?)</script>", s, re.S)):
    f = tempfile.NamedTemporaryFile("w", suffix=".js", delete=False); f.write(m.group(1)); f.close()
    r = subprocess.run(["node", "--check", f.name], capture_output=True, text=True)
    if r.returncode: bad += 1; print("SCRIPT", i, r.stderr[:600])
print("syntax checked, bad =", bad)
PY
