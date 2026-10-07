# Lead fixes on top of base5 + wave-5 patches (run by merge5.sh).
# Section descriptions: the owner wants one short, plain line that says what the section is really about,
# NOT a repeat of the title, and nothing about exams.
import json, glob
DESC = {
  "01": "Arrows and grids of numbers, and the moves you can make with them.",
  "02": "Tidy up a system one row at a time until the answer falls out.",
  "03": "Which vectors you can reach, and the fewest you need to get there.",
  "04": "How a matrix moves the plane, how much it stretches area, and how to undo it.",
  "05": "The special directions a matrix only stretches, and by how much.",
  "06": "Pick axes that make a matrix simple, and find shadows and perpendiculars.",
  "07": "Motion along a path, slopes on a surface, and where the peaks and valleys are.",
  "08": "Arrows everywhere: how they spread, spin, and push you along a path.",
  "09": "Add things up over a region, and trade a loop for the area inside it.",
  "10": "Flow through a surface, circulation around its edge, and volume in 3-D.",
}
for f in sorted(glob.glob('merged/data/*.json')):
  key = next(k for k in DESC if f'section{k}' in f)
  raw = open(f, encoding='utf-8').read(); d = json.loads(raw)
  old = d['studentFacingDescription']
  # replace the one JSON string value in place, so the rest of the file's formatting stays identical
  a, b = json.dumps(old, ensure_ascii=False), json.dumps(DESC[key], ensure_ascii=False)
  assert raw.count('"studentFacingDescription": ' + a) == 1, f
  raw = raw.replace('"studentFacingDescription": ' + a, '"studentFacingDescription": ' + b)
  json.loads(raw); open(f, 'w', encoding='utf-8').write(raw)
print('lead fixes 3: section descriptions set')

# MathJax: if a view was drawn before MathJax finished loading (slow phones, first visit), typesetMath() was a no-op and
# nothing typeset later, so raw \( \) stayed on screen. Remember that, and typeset the page as soon as MathJax is ready.
p = 'merged/index.html'; h = open(p, encoding='utf-8').read()
fx = [
  ("    startup: {\n      typeset: false\n    }\n  };",
   "    startup: {\n      typeset: false,\n      // a view drawn before MathJax arrived asked for math: typeset it now\n"
   "      ready() { MathJax.startup.defaultReady(); MathJax.startup.promise.then(() => { if (window.__mjWaiting) { window.__mjWaiting = false; typesetMath(); } }); }\n    }\n  };"),
  ("      try { MathJax.typesetClear(); } catch (_) {}\n    });\n  }\n  return Promise.resolve();\n}",
   "      try { MathJax.typesetClear(); } catch (_) {}\n    });\n  }\n  window.__mjWaiting = true;   // MathJax still loading: its ready() hook typesets the page\n  return Promise.resolve();\n}"),
]
for a, b in fx:
  n = h.count(a)
  if n != 1: print('lead fix NOT applied (matches %d):' % n, a[:60]); continue
  h = h.replace(a, b)
open(p, 'w', encoding='utf-8').write(h); print('lead fixes 3: MathJax late typeset')
