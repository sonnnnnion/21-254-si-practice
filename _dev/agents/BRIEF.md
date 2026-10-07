# Brief for the polish agents (read all of it before starting)

You are one of 10 agents polishing **21-254 Practice Lab**, a free study site for CMU's Linear Algebra & Vector
Calculus course (unofficial, made for students who find the course hard). The whole site is one large file,
`index.html`. Your job: find and fix bugs, roughness and confusing bits in **your assigned part only**, verify every
fix with screenshots, and hand back a patch plus a short report.

## Your workspace (never touch anything outside it)
- Your copy of the site: `~/Desktop/21-254/agents/aNN/` (NN = your number). Edit only files in there.
- It is already being served at `http://127.0.0.1:83NN/` (e.g. agent 04 → port 8304).
- `~/Desktop/21-254/agents/base/` is the untouched starting copy: never edit it.
- Do NOT edit `~/Desktop/21-254/github-upload`, `~/Desktop/21-254/repo`, or anything else. No git commands, no pushes.
- Do NOT run `tools/qa/sync.sh`.

## Edit boundaries (so 10 patches merge cleanly)
- Only change code inside the `vzAdd({ ... })` / `stAdd({ ... })` blocks of your assigned ids, plus constants or
  functions used **only** by them (e.g. `VZ_GAUSS` for `gauss`).
- Do NOT change shared helpers (`vzLabel`, `vzNote`, `vzKey`, `vzPlane`, `vzCam`, `vzArrow*`, `vzPath3`, `vzTipLabels`,
  `vzGlide`, `vzNoteFade`, `vzPillMorph`, `vzProjScene`, `vzGaussScene`, `stEase`, `stM`, `stGrid`, the Play engine
  `vzPlayStep`/`vzSetPlay`, CSS, etc.). If one of them causes a problem, describe the problem and the fix you'd make
  in your report instead. (Agent 10 is the exception: see its own scope.)
- Find your blocks with grep, e.g. `grep -n 'id: "work"' index.html`, then read with an offset (the file is ~18,000
  lines: never read it whole).

## What "good" means here (the owner's standing rules)
1. **Don't intimidate students.** Short text everywhere. A picture's side panel is: title, a one-line subtitle
   (`tagline`), a one-line `tryIt`, the controls, a few numbers (`readout`), a one-sentence status. The longer
   explanation (`blurb`) sits behind a collapsed "The idea". Keep `tryIt` under ~70 characters, statuses to one short
   sentence, readouts to about 3–4 short lines. On-picture captions: a few words.
2. **Smooth, video-like motion.** Nothing pops or spawns in; things fade, grow or glide. No blank flashes. Labels never
   jump between spots from one frame to the next. Pauses are short. Loops reset cleanly.
3. **Polish like the home-page hero animations**: nothing overlapping (labels on arrows, on each other, on the legend,
   off the edge of the picture), sensible camera angles in 3-D, readable sizes, a legend whenever colour means
   something, uncluttered.
4. **Correct math.** If you change a number or an example, verify it (python3 at `~/anaconda3/bin/python3` has sympy).
   Use the course's notation: vectors in brackets `[a, b, c]`, `proj_w(v)`, `comp_w(v)`, `v∥`, `v⊥`. Never use
   past-exam problems; examples are our own.
5. Behaviour must hold up when a student is careless: dragging handles onto each other or off the picture, pressing
   Play mid-way, switching presets mid-animation, turning the view, phone width (390 px).

## How to check (headless Chrome tools in `~/Desktop/21-254/tools/qa`, run from that folder)
Always pass `BASE=http://127.0.0.1:83NN` (your port) and an `OUT` folder under
`/private/tmp/claude-501/agents/aNN/`. Run one tool at a time (10 agents share this machine).
```bash
cd ~/Desktop/21-254/tools/qa
B=http://127.0.0.1:83NN; O=/private/tmp/claude-501/agents/aNN
# screenshots of states (Visualize pictures: state keys; methods: pass a JS 4th item to set ST.k / ST.b)
BASE=$B OUT=$O/s STATES='[["work",{"al":120},"a"],["work",{"fld":1,"al":200},"b"]]' node ../cdp.mjs shots.mjs
# a filmstrip of what a student sees when they press Play (real time)
BASE=$B OUT=$O/f IDS=work EVERY=400 FRAMES=16 SC=.45 node ../cdp.mjs film.mjs
# contact sheet of a folder of pngs, so you can look at many frames in one image
DIR=$O/f OUT=$O/fs N=16 W=300 C=4 node ../cdp.mjs sheet.mjs
# pop / snap detector while playing and turning the view (SAVE keeps the worst before/after frames)
BASE=$B IDS=work N=400 SAVE=$O/flk node ../cdp.mjs flicker.mjs
# careless-user drags/clicks; random-state fuzz; method checks; method picture pop detector
BASE=$B IDS=work node ../cdp.mjs chaos.mjs
BASE=$B node ../cdp.mjs fuzz.mjs            # (all pictures; slow: run once near the end)
BASE=$B IDS=m-gauss node ../cdp.mjs steps.mjs
BASE=$B IDS=m-gauss node ../cdp.mjs methflicker.mjs
# phone width: add W=390 H=844 SC=1 to shots.mjs
```
Look at the images yourself (Read the png) — the tools catch errors, your eyes catch ugliness. For a method
screenshot use a 4th item like `"(() => { ST.k = 2; ST.b = 99; stShow(); ST.beatT0 = performance.now() - 30000; stPic(performance.now()); })()"`.

## When you finish
1. Make your patch: `cd ~/Desktop/21-254/agents && diff -ru base aNN > aNN.patch` (it must contain only your changes).
2. Your final message (your report) must list, briefly:
   - each change you made (which picture/method, what, why);
   - bugs you found and fixed;
   - problems you found but did not fix (especially anything outside your boundaries), with the fix you suggest;
   - what you verified and how (which tools, which screenshots you looked at).
Keep the report under ~400 words. Do not paste the patch into the report.

---
# Second wave (agents 11–20): differences from the above
- Your starting copy and diff base is `~/Desktop/21-254/agents/base2/` (not `base/`). Make your patch with
  `cd ~/Desktop/21-254/agents && diff -ru base2 aNN > aNN.patch`.
- Ports: agent 11 → 8311 … agent 20 → 8320. Scratch: `/private/tmp/claude-501/agents/aNN/`.
- Agents 01–10 are working at the same time on the existing pictures, methods and page layouts. Do not edit those.
- For `problems_audit.mjs` and `site_qa.mjs` (in `~/Desktop/21-254/tools/`, run them as `node cdp.mjs problems_audit.mjs`
  from that folder) set `BASE=http://127.0.0.1:83NN/` WITH the trailing slash.

## Tool agents (11–14): build one new "check your own work" tool each
- base2 already registers a new Visualize group "Check your own work" with ids `tool-rref`, `tool-det`, `tool-eigen`,
  `tool-vec`, and has a one-line placeholder comment `/* @@AGENT-NN PLACEHOLDER (...) @@ */` for each of you (just
  before `const VZ_TAGLINE = {`). Replace ONLY your placeholder line with your `vzAdd({ id: "<your id>", ... })` block.
  Do not touch the spacer lines, the group list, or anything else.
- Put every helper you need inside your block or in constants/functions whose names start with your prefix
  (`TRREF_`, `TDET_`, `TEIG_`, `TVEC_` / `trref…` etc.). You may CALL shared helpers (`vzPlane`, `vzArrow`, `vzLabel`,
  `vzKey`, `vzNote`, `vzVec`, `vzFrac`, `vzShort`, `vzTweenTo`, `escapeHtml`, …) but never change them.
- Study how existing pictures are written first (e.g. the `inverse`, `gauss`, `projection` and `systems` blocks:
  state, controls incl. `type: "matrix"` inputs, `panelTop`/`sync`/`onClick` for chips and buttons, `draw`, `readout`).
- What a student wants: type their own small numbers (integers or simple fractions), see the answer AND the working
  laid out step by step like they would write it, with exact fractions (no 0.333…), and a clear picture where one
  makes sense. Keep it simple and inviting: short labels, sensible defaults (an example already filled in), a
  "Show next step" / "Show all steps" flow is welcome, nothing overwhelming. Handle bad input gracefully (blank,
  huge numbers, singular matrices, zero vectors). Must work at phone width. Smooth, no pop-ins.
- Verify the arithmetic on many random inputs against sympy (`~/anaconda3/bin/python3`) — write a small script.

## Content agents (15–18)
- Practice problems live in `data/*.json` (one file per section; problems with statements, hints, solutions, steps).
  Walkthroughs live in `walkthroughs/*.json`. Agent 10 owns each section's `sectionTitle` and
  `studentFacingDescription` and the page layouts: do not edit those fields or index.html.
- Check every problem you own: math correct (re-derive with sympy at ~/anaconda3/bin/python3), hints actually help, wording short and plain
  (students must not feel intimidated), no typos, MathJax renders (problems_audit.mjs). Fix errors in the JSON with
  minimal edits (keep the JSON valid: check with `python3 -m json.tool`). Do not invent new problems.

## Review agents (19–20): report only
- Do not edit any files (your patch will be empty; that is expected). Your report IS the deliverable, so it may be up
  to ~900 words: a ranked list of concrete problems with where they are and the exact fix you recommend.

---
# Third wave (agents 21–26): a second pass, on top of the first pass
- Your starting copy and diff base is `~/Desktop/21-254/agents/base3/` (base + the first-pass work that has landed).
  Patch: `cd ~/Desktop/21-254/agents && diff -ru base3 aNN > aNN.patch`. Ports 8321–8326. Scratch `/private/tmp/claude-501/agents/aNN/`.
- **READY rule:** only edit a picture/method listed as READY in `~/Desktop/21-254/agents/READY.md`. Others are still being
  edited by a first-pass agent. When their work lands, the lead applies it to BOTH your copy and base3 and moves the
  ids to READY. Re-read READY.md every so often. Start with what is ready; take notes on the rest and fix them once ready.
  Never edit a NOT READY block (the lead's refresh would then fail to apply to your copy).
- Agent 26 owns the shared runtime (see its prompt). Agents 21–25 must not edit it; report runtime problems instead.
