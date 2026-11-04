# Wave 6 (2026-11-03): register the new ids and add one insertion placeholder per builder in agents/base6/index.html
import re, sys, pathlib
p = pathlib.Path.home() / "Desktop/21-254/agents/base6/index.html"
s = p.read_text()
def sub1(old, new):
    global s
    assert s.count(old) == 1, (old[:60], s.count(old))
    s = s.replace(old, new)
# groups
sub1('"Functions of two variables": ["level", "partials", "chain", "gradient", "critical"],',
     '"Functions of two variables": ["level", "partials", "chain", "gradient", "critical", "crit3d", "evt"],')
sub1('"Vector fields and line integrals": ["gradfield", "fields", "curtain",',
     '"Vector fields and line integrals": ["gradfield", "fields", "probe", "zoo", "fieldmatch", "curtain",')
sub1('"Check your own work": ["tool-rref", "tool-det", "tool-eigen", "tool-vec"],',
     '"Check your own work": ["tool-rref", "tool-det", "tool-eigen", "tool-vec", "tool-crit", "tool-field"],')
sub1('"m-dirderiv", "m-extrema", "m-wire", "m-potential",',
     '"m-dirderiv", "m-critical", "m-extrema", "m-curldiv", "m-isgrad", "m-merge", "m-setup", "m-wire", "m-potential",')
# practice links
sub1('"m-dirderiv": 7, "m-extrema": 7,', '"m-dirderiv": 7, "m-extrema": 7, crit3d: 7, evt: 7, "m-critical": 7, "tool-crit": 7,')
sub1('"m-potential": 8, "m-square": 8,', '"m-potential": 8, "m-square": 8,\n  probe: 8, zoo: 8, fieldmatch: 8, "m-curldiv": 8, "m-isgrad": 8, "m-merge": 8, "m-setup": 8, "tool-field": 8,')
# block placeholders, with spacer lines so each builder's patch has its own context
spacer = "\n".join(f"/* ---- wave-6 spacer {i} ---- */" for i in range(1, 8))
ph = lambda n, what: f"/* @@AGENT-{n} PLACEHOLDER ({what}) @@ */"
blocks = "\n".join([spacer, ph("E1", "methods m-critical, m-curldiv, m-isgrad, m-merge, m-setup"), spacer,
                    ph("E2", "pictures crit3d, evt, probe, zoo"), spacer,
                    ph("E3", "tools tool-crit, tool-field"), spacer,
                    ph("E4", "practice fieldmatch"), spacer, ""])
sub1("\nconst VZ_TAGLINE = {", "\n" + blocks + "const VZ_TAGLINE = {")
# CSS placeholders
cs = "\n".join(f"  /* ---- wave-6 css spacer {i} ---- */" for i in range(1, 8))
css = "\n".join([cs] + sum([[f"  /* @@CSS-{n} (your CSS goes on the lines just below this one) @@ */", cs] for n in ("E1", "E2", "E3", "E4")], []))
i = s.index("\n</style>")
s = s[:i] + "\n" + css + s[i:]
p.write_text(s); print("ok", len(s))
