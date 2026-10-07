# Lead fixes applied after every agent patch (run by merge.sh). Each replacement must match exactly once.
p = 'merged/index.html'; s = open(p).read()
fixes = [
  # vzPath3 always wrote fill="none" before the caller's attrs; with a duplicate attribute the first one wins,
  # so every filled 3-D path (level planes, partials cell, flux patch, m-cylinder lid) was drawn empty.
  ('const vzPath3 = (cam, pts, attrs) => `<path d="M${pts.map(p => { const q = cam(p[0], p[1], p[2]); return q2(q[0]) + " " + q2(q[1]); }).join("L")}" fill="none" ${attrs}/>`;',
   'const vzPath3 = (cam, pts, attrs) => `<path d="M${pts.map(p => { const q = cam(p[0], p[1], p[2]); return q2(q[0]) + " " + q2(q[1]); }).join("L")}" ${/(^|\\s)fill="/.test(attrs || "") ? "" : \'fill="none" \'}${attrs}/>`;'),
  # m-switch: the last sweep (starts .8 s, lasts 2.8 s) outlasted the default 3.2 s picture time and froze at ~99%
  ('  problem: "Evaluate \\\\(\\\\displaystyle\\\\int_0^{\\\\pi/2}\\\\!\\\\!\\\\int_{2x}^{\\\\pi}\\\\frac{\\\\sin y}{y}\\\\,dy\\\\,dx\\\\).",\n  pic(k, b, u) {',
   '  problem: "Evaluate \\\\(\\\\displaystyle\\\\int_0^{\\\\pi/2}\\\\!\\\\!\\\\int_{2x}^{\\\\pi}\\\\frac{\\\\sin y}{y}\\\\,dy\\\\,dx\\\\).",\n  picDur: 4200,\n  pic(k, b, u) {'),
]
for a, b in fixes:
  n = s.count(a)
  if n != 1: print('lead fix NOT applied (matches %d):' % n, a[:70]); continue
  s = s.replace(a, b)
open(p, 'w').write(s); print('lead fixes: done')
