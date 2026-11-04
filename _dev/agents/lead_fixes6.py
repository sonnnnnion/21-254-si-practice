# Wave 6 lead fixes, applied to agents/merged/index.html after the e1..e4 patches (see MERGE_TODO wave 6)
import pathlib
p = pathlib.Path.home() / "Desktop/21-254/agents/merged/index.html"
s = p.read_text()
def sub(old, new, start=None, end=None, n=1):
    global s
    a = s.index(start) if start else 0
    b = s.index(end, a) if end else len(s)
    seg = s[a:b]
    assert seg.count(old) == n, (old[:70], seg.count(old))
    s = s[:a] + seg.replace(old, new) + s[b:]
# e1 m-merge: "no partner" belongs to the xy tile, not beside the merged x²y tile
sub('vzLabel(c2[1], rowY(0) + 6, "no partner", VZ.red, 16)', 'vzLabel(mx + 2, rowY(1) + 6, "no partner →", VZ.red, 15)')
# e1 m-setup: no grading talk
sub('Most of the marks, and most of the thinking, are in the set-up. Evaluating comes after.', 'Most of the thinking is in the set-up. Evaluating comes after.')
# e1 m-critical: this example has no local min, so the legend shows only what is drawn
sub('vzKey([["dot", VZ.red, "max"], ["dot", VZ.ink, "min"], ["dot", VZ.gold, "saddle"]], 16, 452)',
    'vzKey([["dot", VZ.red, "max"], ["dot", VZ.gold, "saddle"]], 16, 452)', start='id: "m-critical"', end='id: "m-curldiv"')
# e2 evt: closed and bounded guarantees the extremes (it is not an "only if"), and the subtitle is one short line
sub('tagline: "A continuous f reaches its highest and lowest values only if D is closed and bounded.",',
    'tagline: "Closed and bounded: the top and the bottom are both reached.",')
# e2 zoo: grid labels a little bigger so they stay readable at phone width
sub('font-size="14"', 'font-size="16"', start='const VZ6_ZOO = [', end='id: "evt"', n=2)
# e1 m-isgrad: the swirl's 1/r arrows were tiny far out; a gentler length curve keeps the swirl readable everywhere
sub('arrows(P, K, 5, 5, k === 2 ? L(2, 0, .1, 1) : .5, [1.1, 1.1, 24, .9])', 'arrows(P, K, 5, 5, k === 2 ? L(2, 0, .1, 1) : .5, [1.1, 1.1, 24, .4])')
# site-wide colour key for critical points (new pictures): max red, min ink, saddle gold. The older concept sketch
# had min gold and saddle ink; swap them inside that one sketch only.
a = s.index("extrema: () => ({"); b = s.index("formula:", a); seg = s[a:b]
assert seg.count("var(--gold)") == 6 and seg.count("var(--ink)") == 2 and seg.count("cv-ext-arrG") == 4
seg = seg.replace("var(--gold)", "\x00").replace("var(--ink)", "var(--gold)").replace("\x00", "var(--ink)").replace("cv-ext-arrG", "cv-ext-arrI")
s = s[:a] + seg + s[b:]
# e3 left its own begin/end marker comments: keep the code, drop the markers
import re
s = re.sub(r"\n[ \t]*/\* @@E3-(CSS-)?(BEGIN|END)[^\n]*\*/", "", s)
assert "@@" not in s, "scaffolding left"
p.write_text(s); print("lead fixes 6: ok")
