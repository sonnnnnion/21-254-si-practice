# Wave 8 handoff (written 2026-11-04 when the owner's laptop was at 5%)
Owner's latest ask: "make everything at its best level". Owner greenlights before ANY push to main (main = 36ea9ad).

## State
- dev has wave 8 + polish pass + (this checkpoint) m-sketch height-stick intro + m-stokes 3 chips
  (loop→surface 24π, surface→loop paraboloid cap 8π, hemisphere→disk 16π; all re-derived by hand).
- Agent copies: ~/dev-21254/w8/g1..g4 (served 8381..8384 by ~/dev-21254/tools/serve.py PORT DIR), base8, merged (8390).
  Rebuild: cd ~/dev-21254/w8 && ./merge8.sh 1 2 3 4   (registry reject is expected; rejcheck.py handles it)
- QA scripts: site/_dev/tools/qa/student.mjs (every chip×step, W=390 for phone; writes issues.jsonl),
  scrollchk.mjs, stats.mjs. Run from that dir: BASE=http://127.0.0.1:8390 OUT=<dir> IDS=<ids> node ../cdp.mjs <script>

## Remaining to-do (target: zero student.mjs flags except the intended "▢" slot overlaps in m-chain)
1. Re-run student.mjs on all 16 new ids at 1440 and 390 on the fresh merge; collect flags.
2. Known flags to clear (from earlier runs): axis letters clipped at stage edge (m-work "x"/"y", m-param "x",
   m-dblint "x", m-tangent phone "z" maybe fixed); m-greencheck "y" axis label hidden under the checklist box;
   m-lineint two-pieces chip "C₁" vs "ds = |r′(t)| dt"; m-work circle "r′(t)" vs "start, end";
   m-surfint phone "y" vs "dS = √2 dA"; m-dblint triangle "enters/leaves". Owner of each: g1 = m-param/m-tangent,
   g2 = m-lineint/m-work/m-dblint/m-greencheck/m-surfint/m-merge, g3 = m-sketch/m-chain/m-tanplane/m-extrema,
   g4 = m-polar/m-paramsurf/m-stokes/m-divthm.
3. m-tangent circle chip: "r(t₀) + s r′(t₀)" label sits on the circle (ll: [-4, 22, "end"] in G1_CI) — move off.
4. Look at new m-stokes chips 2/3 and the m-sketch saddle sticks up close (1440 + 390).
5. Final: merge, student.mjs both widths, steps.mjs (all 47), methflicker (16 ids), monkey; commit + push dev;
   summarize to owner. Do NOT push main.

## Dispatched at checkpoint (if interrupted, re-check these copies' patches; re-send if not done)
- g2: clear flags in m-work, m-dblint, m-greencheck, m-lineint, m-surfint (list above, desktop run) → zero flags.
- g1: m-param level-curve x clip + ∇f label; m-tangent circle-chip tangent-line label off the circle.
- Phone (390) run of all 16 was in progress; re-run it after the merge.
