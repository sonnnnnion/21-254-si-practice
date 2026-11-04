# remove the wave-6 spacer/placeholder scaffolding from agents/merged/index.html (unfilled placeholders are reported)
import re, pathlib
p = pathlib.Path.home() / "Desktop/21-254/agents/merged/index.html"
s = p.read_text()
left = re.findall(r"/\* @@AGENT-E\d PLACEHOLDER[^\n]*", s)
if left: print("UNFILLED:", left)
s = re.sub(r"\n[ \t]*/\* ---- wave-6 (css )?spacer \d+ ---- \*/", "", s)
s = re.sub(r"\n[ \t]*/\* @@(AGENT-E\d PLACEHOLDER|CSS-E\d)[^\n]*@@ \*/", "", s)
p.write_text(s); print("stripped; scaffolding left:", len(re.findall(r"wave-6|@@AGENT|@@CSS", s)))
