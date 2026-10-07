# Lead fixes on top of base4 + wave-4 patches (run by merge4.sh). Each replacement must match exactly once.
p = 'merged/index.html'; s = open(p).read()
fixes = [
  # Exam Mode: the clock turned red at a fixed 50 min, but 8 problems are estimated at ~79 min. Use the set's own estimate.
  ('   stopwatch in the corner that keeps going across every question and turns\n   red at 50 minutes,',
   '   stopwatch in the corner that keeps going across every question and turns\n   red at the set\'s estimated time,'),
  ('const EXAM_LATE_SEC = 50 * 60;\n',
   '// the set\'s estimated time (each problem\'s estimatedMinutes, else 10), rounded up to 5 min\n'
   'const examLateSec = r => Math.max(10, Math.ceil(r.ids.reduce((m, id) => { const p = State.problemsById && State.problemsById.get(id); return m + (+(p && p.estimatedMinutes) || 10); }, 0) / 5) * 5) * 60;\n'),
  ('    const sec = examElapsed(r), late = sec >= EXAM_LATE_SEC;\n    t.textContent = fmtClock(sec);',
   '    const sec = examElapsed(r), late = sec >= examLateSec(r);\n    t.textContent = fmtClock(sec);'),
  ('  const sec = examElapsed(r), late = sec >= EXAM_LATE_SEC;\n  root.innerHTML = `',
   '  const sec = examElapsed(r), late = sec >= examLateSec(r);\n  root.innerHTML = `'),
  ('${late ? "over the 50-minute mark" : "total time"}',
   '${late ? `over the ~${examLateSec(r) / 60}-minute estimate` : "total time"}'),
  # 3-D concept sketches said "Drag to rotate" twice (panel tag + on-canvas hint)
  ('<span class="concept-panel-tag">${interactive ? "Drag to rotate" :',
   '<span class="concept-panel-tag">${interactive ? "" :'),
  # vecmat-001 sketch caption: the italic caption font draws ‖ like "ll" ("lla − bll")
  ('the Pythagorean theorem gives ‖a − b‖ straight from ‖a‖ and ‖b‖.",',
   'the Pythagorean theorem gives the length of a − b from the lengths of a and b.",'),
]
for a, b in fixes:
  n = s.count(a)
  if n != 1: print('lead fix NOT applied (matches %d):' % n, a[:70]); continue
  s = s.replace(a, b)
assert 'EXAM_LATE_SEC' not in s, 'EXAM_LATE_SEC still used'
open(p, 'w').write(s); print('lead fixes 2: done')
