#!/usr/bin/env python3
"""node --check every inline <script> in index.html. Run after ANY edit to index.html."""
import re, subprocess, tempfile, os
h = open(os.path.expanduser("~/Desktop/21-254/github-upload/index.html")).read(); bad = 0
for i, s in enumerate(re.findall(r'<script>(.*?)</script>', h, re.S)):
    f = tempfile.NamedTemporaryFile('w', suffix='.js', delete=False); f.write(s); f.close()
    r = subprocess.run(['node', '--check', f.name], capture_output=True, text=True); os.unlink(f.name)
    print(i, 'OK' if r.returncode == 0 else r.stderr[:300]); bad += r.returncode != 0
print('syntax errors:', bad)
