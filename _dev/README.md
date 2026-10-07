# Working on 21-254 Practice Lab (read this first)

**Branches**
- `main` is the live site (GitHub Pages builds from `main` /). Do not push to `main` unless the owner says to publish.
- `dev` is where work happens. Commit and push to `dev` often, so the next session (local or cloud) can pick up exactly where the last one stopped.
- To publish later, merge `dev` into `main` (no squash needed) and wait for the Pages build (`_dev/tools/qa/waitpages.sh <sha>`).

**What is here**
- The site: `index.html` (one large file: all pages, all Visualize pictures and methods), `data/` (practice sections), `walkthroughs/`, `sw.js`, `vendor/`.
- `_dev/HANDOFF.md`: what has been done, round by round. Newest round is at the top of its table.
- `_dev/WORKLOG.md`: plans and checklists, including the lecture coverage map (section P).
- `_dev/tools/`: headless-Chrome checks (`cdp.mjs` driver, `qa/*.mjs`). See `_dev/tools/qa/README.md`.

**Run it**
```bash
python3 -m http.server 8254          # from the repo root
cd _dev/tools/qa
node ../cdp.mjs fuzz.mjs              # every picture, random states: no NaN/undefined/errors
node ../cdp.mjs steps.mjs             # every method plays to the end, math typeset, phone overflow
node ../cdp.mjs flicker.mjs           # pops/snaps while playing (rasterised frame diff)
node ../cdp.mjs methflicker.mjs       # the same for method pictures
node ../cdp.mjs monkey.mjs            # every page, random clicks, page errors
OUT=/tmp/s STATES='[["work",{"al":120},"a"]]' node ../cdp.mjs shots.mjs   # screenshots of states
```
Tools read `BASE` (default `http://127.0.0.1:8254`) and `CHROME` (path to Chrome/Chromium; Mac and common Linux paths are found automatically).

**Standing preferences from the owner (keep to these)**
- The site exists to NOT intimidate students: short text everywhere, simple tools, one idea per picture. Side panel = title, one-line subtitle, one-line "Try", controls, a few numbers, a one-sentence status; the longer explanation sits behind "The idea".
- Animations must be smooth and video-like: nothing pops or spawns in, short pauses, explicit loop resets (the finished picture dissolves into the start), no blank flashes.
- Every picture must match the polish of the home-page hero animations; check frames with screenshots before calling anything done.
- Always a legend when colour carries meaning. Keep pages uncluttered.
- Never use past-exam problems; examples are our own (may resemble the lectures, never copy them).
- Methods (step-by-step): all work stays on the board, ~30–60 s at Normal speed, smooth fades.

**Not in the repo**
- The course lecture notes (35 lectures) are the owner's local copy (`~/Desktop/linalglectures.zip`); they are course material, so they are not committed. The coverage map in WORKLOG section P lists what each lecture covers and which picture/method answers it.
