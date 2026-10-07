# 21-254 Practice Lab — Handoff

**Last updated:** 2026-10-01 (round 15: smooth Play everywhere, video-like methods, look-and-feel pass)
**Status:** Live and in sync (see the Done table for the latest commit). Round 7 (2026-09-30): Visualize polish (Play on every slider, exact values, clearer systems/projection/gradient/critical/fields, simple complex-eigenvalue picture), polar hero back to the stretching version with no numbers, ascent hero on a tilted ridge, smoother hero clock, no answers in any sketch, "(c)" fix.

---

## What this project is

An unofficial practice-problem website for **CMU 21-254 (Linear Algebra & Vector
Calculus for Engineers)**, built by Michael Bockstaller, SI leader for the course.

- **Live site:** https://sonnnnnion.github.io/21-254-si-practice/#/home
- **GitHub repo:** `sonnnnnion/21-254-si-practice` (branch `main`, GitHub Pages from repo root)
- **95 practice problems** across 10 sections + a hidden SI-leader walkthroughs area (22 sessions)

**Context:** Prof. Dylan Quintana approved sharing it as an unofficial, optional supplement.
Lucy Delaney (Assistant Director of SI) loved it and proposed a **staggered rollout**:
hold off a few weeks, share with SI attendees only (QR code at sessions), then consider the
whole class; review attendance + site data at the end of Fall, possibly present at the
all-staff meeting before Spring. The bar is *professor-facing quality*: one visible raw-LaTeX
leak is a serious problem, not a nitpick.

**Exam schedule (confirmed by Prof. Quintana, matches site's `EXAM_MAP` — no change needed):**
Exam 1 = lectures 1–9 (S1–S4), Exam 2 = 10–17 (S4–S6), Exam 3 = 18–26 (S7–S8),
Exam 4 = 27–35 (S9–S10, held during finals week), plus a cumulative final.

---

## Where everything lives

| Path | What |
|---|---|
| `~/Desktop/21-254/github-upload/` | **Source of truth.** Edit here. |
| `.../index.html` | The whole app — single file, ~400 KB, vanilla HTML/CSS/JS |
| `.../data/*.json` | 10 section files, 95 problems |
| `.../walkthroughs/*.json` | 22 SI sessions + `walkthroughs_index.json` |
| `.../vendor/mathjax/tex-svg.js` | Local MathJax 3.2.2 core (no CDN) |
| `.../vendor/mathjax/input/tex/extensions/color.js` | MathJax `color` extension (needed for walkthrough matrix highlighting) |
| `~/Desktop/21-254/tools/` | Tools (NOT published): `scan_data.py`, `browser_audit.js`, `check_scripts.py`, `make_qr.py`, `qr_decode.swift`, `make_glyphs.py`, `hero_preview.py`, `cdp.mjs` (headless Chrome driver) |
| `tools/sketches/` | **Problem sketch sources** (`kit.js`, `common.js`, `sec1..9.js`, `viz.js`) + `splice.py` + `build.sh`. Edit here, never inside index.html |
| `tools/sketch_tex.mjs`, `tools/hero_tex.mjs` | Pre-render math labels with the site's MathJax into glyph atlases (`SK_TEX`, `HERO_TEX`) |
| `tools/teach/` | SI session scripts `siNN.py` (TEACH dicts) + `merge_teach.py` (validates, then merges into walkthrough JSON) |
| `tools/problems_audit.mjs`, `site_qa.mjs`, `sketch_gallery.mjs`, `viz3d_shots.mjs` | CDP checks: every problem's math + sketch; every route at desktop/375; sketch galleries; 3-D panels |
| `.../og-image.png` | 1200×630 link-preview image (Canvas/GroupMe/Discord cards), rendered from the site's own hero art |
| `~/Desktop/21-254 Practice Lab.app` | Double-click desktop app (macOS) |
| `~/Library/Application Support/21-254 Practice Lab/site/` | Copy the desktop app + local preview serve |
| GoatCounter dashboard | https://mbocksta.goatcounter.com (login: Michael's account) |

`~/Desktop/21-254/github/` is an OLD folder — ignore it.

---

## How to work on this

### Local preview (port 8254)
```bash
rsync -a --delete "$HOME/Desktop/21-254/github-upload/" \
  "$HOME/Library/Application Support/21-254 Practice Lab/site/"
# restart if needed (health check must be HTTP 200, not just "something answers"):
lsof -ti tcp:8254 | xargs kill -9
nohup /usr/bin/python3 -m http.server 8254 --bind 127.0.0.1 \
  --directory "$HOME/Library/Application Support/21-254 Practice Lab/site" &
```

### Publishing (gh CLI authenticated as `sonnnnnion`)
```bash
gh repo clone sonnnnnion/21-254-si-practice /tmp/repo
rsync -a --delete --exclude='.git' "$HOME/Desktop/21-254/github-upload/" /tmp/repo/
cd /tmp/repo && git status && git add -A && git commit -m "..." && git push origin main
```
Check `git status` before committing — it should list only the files you meant to change.
Pages rebuilds in ~30–60 s. **Verify via the GitHub API or the Pages URL, not
raw.githubusercontent.com** (its CDN serves stale copies for several minutes).

### Editing `index.html` (monolith)
- Never read it whole — grep an anchor, read with offset/limit, re-read right before editing.
- Prefer a Python edit with `assert s.count(old) == 1`.
- **Always** run `/usr/bin/python3 ~/Desktop/21-254/tools/check_scripts.py` afterwards.

### Editing data JSON
All data and walkthrough files round-trip byte-exactly with
`json.dumps(d, indent=1, ensure_ascii=<per file>) + "\n"` (S4 and S10 use `ensure_ascii=False`,
the rest `True`). So you can edit through a parser and the diff shows only the changed strings.

---

## Verification state (all passing as of 2026-09-29)

- **Round 6 checks:** `problems_audit.mjs` → 95/95 problems at 1280 and 375 px: 0 MathJax errors, 0 red
  undefined macros, 0 raw TeX/underscores, every problem has a per-problem sketch or 3-D scene, 0 page errors.
  `site_qa.mjs` → 17 routes × 2 widths, 0 errors, 0 overflow. Guide audit (22 sessions, page + every Teach slide):
  0 merror / red / raw / errors. Heroes: contact sheets over the full timeline for all 10.

- **Math:** 95 final answers sympy-verified (earlier session). Solution **steps** of the
  33 Exam-style/Final-review problems machine-verified step-by-step (Sep). The 62 Warm-up/Core
  problems' steps were step-verified in round 14 (all correct), along with all 74 SI-guide problems.
- **Rendering (browser, fresh loads):** all 95 problems — 0 MathJax errors, 0 raw LaTeX,
  0 plain-text math, problem parts on separate lines. All 22 walkthroughs — 0 visible
  backslashes / "undefined", every page typesets. List/section/review/exam views clean.
  No horizontal overflow at 375 px.
- **Data scan:** `tools/scan_data.py` → 0 hits.
- **Sketches:** every problem's "Visual idea" reviewed; 6 mismatches fixed via `VISUAL_OVERRIDES`.
- **Walkthroughs:** all 22 checked against the TeX MathJax actually typeset (no English inside math),
  visible text (no plain-text math like `det(A)`, `v1`, `R3`, `0<=x<=3`), and raw backslashes. 115 prose
  strings rewritten to delimited LaTeX; 3 sentences that were stored in formula fields fixed.

sympy isn't installed system-wide: `/usr/bin/python3 -m pip install --target=<scratch>/pylibs sympy`
then `PYTHONPATH=<scratch>/pylibs /usr/bin/python3 ...` (the default `python3` on PATH has no pip).

---

## Non-obvious gotchas (these bit us — don't relearn them)

0. **Never use past-exam problems** (the user shares exam pages only to show a method's rhythm). Every site problem must be genuinely different in type and wording, not a number swap.

1. **iCloud + long-running server.** Serve from the `~/Library` copy with `--directory`, never `cd` into Desktop.
2. **Health check = HTTP 200**, not "something answered" (stale servers answer 404).
3. **Math must be delimited** — every equation in `\( \)` or `\[ \]`. Two mirror-image failures:
   - math *missing* delimiters leaks as raw text;
   - a literal bracket *eaten by* a delimiter: `\[A\mid b]` renders as `A|b]` (rref-001, fixed).
     This one throws no MathJax error, so only reading the rendered page catches it.
4. **No plain-text math in prose fields.** Hints, Think First, step labels and skill chips were
   once written as `x3=s`, `R^3`, `[x]_B`. They're LaTeX now; keep new content that way.
   `tools/scan_data.py` flags regressions.
5. **Newlines.** HTML collapses real newlines. `normalizeProse` now turns *blank-line* breaks in
   prose into paragraph breaks (never inside math, not beside display math). A literal `\n`
   followed by a letter still renders visibly (it can't safely be converted: `\nabla`, `\neq`) —
   use `\n\n`. The walkthrough renderer does NOT run `normalizeProse`: never put a literal `\n`
   in walkthrough JSON prose.
6. **MathJax extensions must be vendored.** The local bundle only has base/ams/newcommand/…;
   commands like `\color`, `\cancel`, `\boldsymbol`, `\bbox` try to fetch an extension from
   `vendor/mathjax/input/tex/extensions/`. If the file is missing, the whole page's math fails.
   Only `color.js` is vendored (official 3.2.2). Add others the same way if you use them.
7. **One failed typeset used to kill math for the whole session** (stale MathJax items). Fixed:
   `typesetMath` calls `MathJax.typesetClear()` on failure. Don't remove that.
8. **Matrix rows need `\\`.** A single `\` before a newline is a TeX space: the matrix renders
   as one long row (si-04, fixed).
9. **Walkthrough text renderer (`renderTextOrLatex`/`wrapInlineMath`) is heuristic.** A string
   containing any `\(`/`\[` is passed through verbatim — so *all* its math must then be delimited.
   Strings without delimiters are tokenized and math-looking tokens wrapped.
10. **Storage maps must be type-validated** (`lsGetMap`) or saved work is silently destroyed.
11. **Titles can contain LaTeX** (4 do) — never `.slice()` a title; use CSS ellipsis + `typesetMath`.
12. **Browser eval batches time out ~30 s** — audit ~12–16 problems per call. Programmatic
    scrolling doesn't work in the preview pane; use a tall viewport or wheel-scroll after a screenshot.
13. **"Visual idea" sketches are keyword-picked** (`pickConceptVisual`), and a stray keyword can
    win (e.g. "…using a determinant" → area-scaling sketch). Use `VISUAL_OVERRIDES` for fixes.
14. **Formula fields can hold sentences.** `texBlock`/`texInline` wrap undelimited text as math; a sentence
    becomes "Thepivotsare…". `looksLikeProse()` now routes 2+ English words to the text path. Any walkthrough
    string that contains a `\(` is passed through verbatim, so ALL math in it must be delimited.
15. **`visualSpec` values are machine input.** `bounds.theta: ["0","pi"]` is parsed by `parsePolarAngle` to
    draw; `unitTangent`/`velocity`/`curve` arrays are read by drawers. Never LaTeX-ify them in data;
    `asciiMathValue()` prettifies them for display only (2pi → 2π, sqrt(5) → √5, <= → ≤).
16. **The walkthrough index cards are not typeset.** `sessionGoal` shows there raw — use Unicode (PDP⁻¹), not `\(…\)`.
17. **Semester data to update every term:** `COURSE_LECTURES` + `FINALS_END` in `index.html` (dates → the
    home "This week" strip). After Dec 11 2026 the strip hides itself. Its note says "Recommended review for
    Fall 2026. Always confirm with the course calendar." (`renderWeekStrip`); change the term there too.
18. **The QR code is a static SVG** encoding `…/21-254-si-practice/?qr` (lands on the HOME page; the user does
    not want a special landing page). `QR_ARRIVAL` counts that first view as `/qr`, then strips `?qr` with
    `replaceState`. Old `#/si` links (the QR target for one day) are treated the same and land on home.
    To change the QR, use `tools/make_qr.py` and PROVE it scans with `tools/qr_decode.swift` before shipping.
19. **Home must fit one screen** (1024×768, 1280×720, 1280×800, 1366×768, 1536×864 verified). Measure
    `scrollHeight` before/after any home-page change; at ≥881 px tall the footer shows and a small scroll is
    expected. Media blocks override by source order: the `max-height: 790px` home block must stay AFTER the
    880px one. Reload with a cache-busting query (`/?v=N#/home`); a hash-only navigate doesn't reload.
20. **Route scrolling must be instant, with a layout flush first.** `<html>` has `scroll-behavior: smooth`; the old
    `"instant" in window` check was always false, so every route change glided (or stalled). `jumpTo()` sets
    behavior auto, reads `scrollHeight` (flush), scrolls with `behavior:"instant"`, restores smooth after 60 ms.
    Without the flush Chrome defers the scroll until smooth is back on.
21. **Scroll memory:** `beginNavigation()` stamps each history entry (`history.state.navKey`); Back/Forward
    restores that entry's scroll, list routes (`LIST_ROUTE`) reopen where you left them, detail pages open at top.
22. **Status buttons update in place** (`paintStatus`). Never call `renderProblem` after a status change — it
    collapses open hints/solutions and re-typesets all math.
23. **Mobile grid tracks need `minmax(0, 1fr)`**, not `1fr`: a nowrap/ellipsis child (the resume title) otherwise
    widens the whole page on phones. Test mobile width with `innerWidth === 375`, not scrollWidth vs innerWidth.
24. **Glyphs:** two sets from `tools/make_glyphs.py` (writes `{"tile":…, "art":…}`): `SECTION_GLYPHS` (22px
    home tiles, open chevron heads) and `SECTION_ART` (section-header art: small filled heads `g-head` that
    fade in as their line lands, half-size dots). Drawable strokes carry `pathLength=1` so draw-in is
    dashoffset 1→0; dotted strokes (`g-dash`), dots/heads (`g-dot`) and faint fills (`g-fill`) fade instead.
    Dotted lines are round-capped dots (`stroke-dasharray: .01 gap`) — short round-capped DASHES merge into a
    lumpy "#" at small sizes. Header art sets `stroke-width` in user units (no `vector-effect`, which breaks
    pathLength dashing). Header motion is deliberately slow and even (`--ge` ease-in-out, 1.5 s).
25. **Rotating hero** (`#heroArt`): the inline `<script>` right after the SVG must stay there so the chosen
    picture is in place before first paint. 0 = original circulation SVG (CSS/SMIL), 1 linear map, 2
    eigenvectors, 3 gradient ascent, 4 flux. Each visit shows the next (`pl254:hero`; first visit = 0);
    clicking the picture moves on. New heroes are pure `frame(t)` functions driven by rAF only while home is
    on screen; reduced motion shows `poster` stills. Preview any frame with `tools/hero_preview.py 2@1.63,…`
    (uses the `window.HERO_TEST = {h, t}` hook). The Browser pane reports `document.hidden` and runs no rAF
    while hidden, so it can't show these animating; trust hero_preview frames instead.
26. **Guided solution** (`guideHtml` / `wireGuide`): hints → setup → worked steps → answer on one rail; steps wait
    collapsed IN LAYOUT (`grid-template-rows: 0fr`, `visibility:hidden`) so MathJax measures them; one next button,
    "Skip to the solution", "Show all", "Start over". Opened steps persist per problem for the visit (`GuideMemory`).
    `GuideCtl` drives the H / A shortcuts. Print opens every step. The old reveal boxes and scratch box are gone.
27. **Lectures:** `LECTURES_BY_PROBLEM` / `lectureOf(id)` come from `COURSE_LECTURES` (all 95 problems mapped).
    Exam Mode draws by the professor's lecture ranges (`EXAM_MAP[..].lectures`: 1–9, 10–17, 18–26, 27–35, final =
    all), spread across lectures (round-robin) and shown in course order.
28. **Offline:** `sw.js` (network-first page + JSON, saved-first MathJax/icons/fonts, `VERSION` to bump when CORE
    changes). Registered only on https (or `?sw=1` locally). The Browser pane can't run service workers; test with
    `node tools/cdp.mjs <script>` (headless Chrome over DevTools; can go offline, grant clipboard, real clicks).
    Kill switch if it ever misbehaves: deploy a sw.js that calls `self.registration.unregister()`.
29. **3D scenes (Viz3D):** painter's algorithm made robust: floor lines (`floor:true`) draw first, flat regions
    (`decal:true`) next, then everything else sorted by depth with long lines/arrows cut into 0.12-unit pieces and
    marks nudged toward the camera (`MARK_BIAS`). Rotation is time-based at full frame rate.
30. **User preferences:** no "AI-generated" phrasing ("built by AI"); no "SI-style"; avoid
    AI-design tells (small colored status dots, em-dash "X, not Y" constructions) and em-dashes
    in new UI copy; no browser-native `alert/confirm/prompt` (everything in-site; there are none).
31. **Problem sketches:** `SKETCH[id]()` (tools/sketches) wins over the old keyword `CONCEPT` sketches, which stay as
    fallbacks. After editing a source run `tools/sketches/build.sh [prefix]`: it splices, syncs to the preview copy,
    rebuilds the label atlas, and optionally renders a gallery. New math labels only look right after the atlas
    rebuild (missing ones fall back to Georgia italic). Labels are TeX strings (`"v_1"`, `"\\ker T"`).
32. **Glyph atlases:** `SK_TEX` (between `/*SK_TEX_BEGIN*/` markers, ~100 KB) and `HERO_TEX` hold MathJax glyph paths
    flattened to matrices, drawn as SVG paths or canvas `Path2D`. Both tools need the preview on :8254 and must load
    MathJax from a same-origin page (about:blank fails).
33. **Viz3D:** per-problem scenes register via `Viz3D.addScene("p:<id>", fn)` and are auto-fitted (the engine centres
    on the origin at a fixed scale). Labels go through `texLabel` → atlas. `Viz3D.labels()` feeds the atlas tool.
34. **Exam run:** `pl254:examRun` in localStorage ({choice, ids, idx, startedAt, endedAt, peeked, seen}); routes
    `#/exam/run/N` and `#/exam/run/done`; clock turns red at 50:00; the corner clock moves into the sticky bar under
    1180 px. The run view and the study view share guide ids, so each clears the other's DOM before rendering.
35. **Report issue:** local tag (`pl254:reported`) + GoatCounter event `report/<id>` (title has the kind). The
    Walkthroughs page lists reports once the count feed is on; until then its link opens the dashboard filtered to
    `report/`. Localhost never counts, so test reports only show locally.
36. **Hero formulas** are typeset (HERO_TEX) — re-run `tools/hero_tex.mjs` and paste its line if a formula changes.
    `window.HERO_TEST={h,t}` + `__heroFrame(i,t)` render any hero at any time (harness only).
37. **Manrope quirk:** "(c)" becomes © through Manrope's *standard* ligatures ('liga'), not 'calt'. `body` sets
    `font-variant-ligatures: no-common-ligatures no-contextual`, which covers every page; SVG notes also turn them off.
38. **Sketches never give answers** (user rule, round 7). Titles name the idea, captions give the method, formula
    strips show the general setup (unevaluated), labels name things (`k=\,?`, `\square`, `∗` for entries you
    compute). Given data may appear; computed results, verdicts (true/false, min/saddle) and eigenvalues may not.
    After editing, re-run the leak check (dump SKETCH text vs `finalAnswerLatex` numbers not in `problemLatex`).
39. **Visualize Play:** every slider has Play unless `noPlay`. `progress: true` sliders run → pause 0.9 s → glide back
    to the left; 360° angle sliders wrap; everything else sweeps back and forth, easing near the ends (`vzTick`
    phases rewind/run/hold/sweep). `wrap` may be a function of state (curves wrap only for closed curves).
    Progress sliders start at their left end; `thumb` sets the frame the index card shows.
40. **Hero clock:** `tick` advances `ht` by at most 34 ms per frame, so a hitch slows the picture instead of making it
    jump. Key elements (`data-k`) get a caching `setAttribute` (`quiet`) and captions go through `setText`, so
    unchanged values never touch the DOM. The phone tile replay staggers in CSS (`--td`), with no forced reflow.
41. **Polar hero** is the stretching version: the (r, θ) rectangle curls into the (x, y) plane; axis names cross-fade
    r/θ → x/y; two cells read "Δr Δθ" flat and "r Δr Δθ" curled. The user asked for no numbers on it.
42. **Ascent hero** hill is a tilted ridge (peaks carry `[x, y, h, sLong, sShort, tilt]`); the four starts came from a
    scan for paths that turn 60–80° in total with no sharp local turn (the round-5 complaint was a kink at the saddle).
43. **`[hidden]` always hides** (`[hidden] { display: none !important; }`). Classes like `.btn` or grids used to
    beat the attribute, which left e.g. "Clear status" showing on every problem. Toggle `hidden`, never inline display.
44. **MathJax memory:** `typesetMath` first calls `pruneDetachedMath()`, which drops MathJax items whose DOM was
    replaced. Without it every problem visit leaked ~2,400 nodes (MathJax's document list pinned old pages).
45. **3-D scenes sleep off screen:** the Viz3D loop stops when its canvas leaves view and restarts from the
    IntersectionObserver; dragging draws directly, so it never depends on the loop.
46. **Usage charts** (Walkthroughs → Site usage) read GoatCounter's public counter feed: `/home` all-time and per week
    (`?start=&end=`), every `/problem/<id>`, and `/si-qr`. The feed is off until "Allow adding visitor counts on your
    website" is ticked in GoatCounter settings; until then the card says so. Results cache in sessionStorage 20 min.
    If weekly counts add up past the all-time total (range ignored), the weekly chart hides itself.
    QR arrivals count as `/si-qr` (the shared GoatCounter code's Ops site also uses `/qr`).
    The feed is ON since 2026-09-30 (CORS `*`, and `start`/`end` are honoured: verified).
    **Ad blockers block goatcounter.com** (Brave Shields, uBlock), so the page first reads a snapshot:
    `.github/workflows/usage.yml` runs `.github/scripts/usage.mjs` every 3 hours (and on demand from the Actions
    tab), which writes `usage.json` to the `usage-data` branch (one commit, force-pushed). The page loads it from
    raw.githubusercontent.com (not blocked, CORS `*`) and falls back to the live feed only if it is missing.
    `.github` lives in github-upload/ so the rsync to the repo keeps it.
    The card also shows "Where students go" (Home, Topics, sections, problems, Exam Mode, `/exam/run/1` as runs started,
    Need Review, Visualize + its 14 pages, Walkthroughs + 22 sessions). Cache key `pl254:usage2` (sessionStorage).
    Reports: each report counts `report/<id>` (totals) and `report/<id>/<kind>` (breakdown, from round 10 on).
    The Reported issues card lists open reports with their kinds; "Mark fixed" stores the count in
    `pl254:reportsFixed` (localStorage) so a problem only returns when a new report arrives.
47. **Riemann hero** keeps one box set on screen at a time. Each finer box starts at its parent's height and colour
    (`hp`, `pcols`) and glides to its own, so the refinements have no crossfade ghosts.
48. **Vector sketches → 3-D scenes:** `as3D(id, spec)` in tools/sketches/viz.js turns a problem's static vector
    sketch into a small interactive scene (same title, caption and formula; the static sketch stays as fallback).
    Used for vecmat-001, rref-004, basis-001/002/005/008, diagprojcross-005/006, transdet-007, vecfieldline-002.
    vecmat-002 stays static on purpose (the right angle reads best head-on). Round 9 added the eigenspace scenes
    (eig-002/004/007/008/010, diagprojcross-002/003): no xyz axes (the eigenvectors lie on them), solid eigen-lines
    named at their empty end, planes as sheets. Scenes auto-rotate, so judge a camera with the spin stopped
    (dispatch pointerdown/up on the canvas right after mount) or a drag sweep.
49. **Region sketches** (doublegreen-001…005) use `skPanel2` / `skStrip` / `skPolarCell` in sec9.js: a strip is a thin
    band with dots where it meets the boundary, labelled dx or dy; order-switching problems show both orders side by side.
50. **Visualize blurbs and tips are TeX** (`\(...\)`), typeset after render. The complex-eigenvalue picture was
    removed (beyond the lectures); 14 pictures remain.
51. **SI board sketches** (walkthroughs' `visualSpec`) are drawn by `tools/sketches/walk.js`: `WALK_SKETCH[type](spec)`
    builds each from the spec's own numbers with the problem-sketch kit; `renderVisualSpec` calls `walkSketch(type, spec)`,
    which sets `SK_LS = 1.16` (labels a size up, read across a room and on phones) and falls back to the old
    `svgXxx` renderers only for types without one (the matrix displays). Specs that leave out a function or field
    (gradient_directional_derivative, the helix) carry the problem's own in walk.js; `WS_FNS` / `WS_FIELDS` map the
    spec strings. `tools/sketch_tex.mjs` fetches every walkthrough to collect their labels for the atlas.
    Gallery: scratchpad-style `vs_svg.mjs` (renders every spec into #walkDetail and shoots each `.vs-sketch`).
52. **Exact values stay exact:** `numTex` shows repeating decimals and irrationals in exact form (5/3, √2/2, π/4);
    decimals that end within two places (0.6, 1.1, 3.8) stay as written. `specAtomTex` handles spec strings
    ("1/sqrt(2)" → √2/2, "2pi", "r^2"); bounds inside a `*Bounds` object and `*interval` keys print as a ≤ x ≤ b.
    House style (Michael): leave π, fractions and roots unexpanded; no "≈ 1.37" glosses in the guides.
53. **Heroes:** first-ever visit opens on the Riemann boxes (`FIRST = HEROES.indexOf(riemann)`); later visits
    rotate. Index 0 is now a JS hero (`circ`: swirling flow, a point going round C with F and dr, C filling in lap by
    lap); the static circulation SVG in the markup is only the no-script fallback. The Riemann loop no longer empties
    out: after the surface fades, the 12 × 12 boxes glide to their 3 × 3 ancestors (`h0`, `cols0`) and only the very
    first round rises from the bare square. The polar hero has no caption. On phones the section tiles replay one at
    a time every 4.2 s (`tileReplayNext`), not as a wave.
54. **Visualize engine hooks** (round 12): a picture may define `handles(st) -> [{k, x, y}]` + `dragTo(st, k, x, y)`
    (+ `dragEnd`) in stage units (600 × 450) to be draggable (pointer drag within 26 screen px, arrow keys nudge
    the active handle, Tab moves between handles; the stage gets `touch-action: none`); `panelTop()` (static HTML
    under the blurb), `sync(st, panel)` (keeps it current) and `onClick(el, st)` (return true if it changed state);
    a control's `show(st)` hides it in other states. `VZ_ORDER` sorts the index and the pager; `card` / `tagline`
    are the index card's title and line. Full screen uses the Fullscreen API on `#vizRoot` (`body.vz-fullscreen`).
    Grips (`vzGrip`) are drawn before their arrows so arrowheads stay on top. Dragged points snap to a quarter grid
    (`vzWorld`), and a vector dragged near another's line snaps onto it (`vzOntoLine`), so dependence can be hit.
55. **Subspace playground** (`subspace`): sets in `VZ_SETS[2]` / `VZ_SETS[3]` each carry `has`, `snap` (2-D) or
    `kind` + `p0/a/b/d` (3-D, dragged by un-projecting onto the plane or line), `truth` and one-line `why`s. What the
    student has found lives in the state (`z0`, `f1`, `f2` = 0 untested / 1 held so far / 2 counterexample, with
    `n1`/`n2` counts and `x1`/`x2` texts); `note()` records it from `draw`. The truth is shown only after the
    student's own counterexample or "Check subspace", never up front. A result leaving W gets a ring (`frame`).
56. **Report a problem:** every problem page's button (renamed from "Report issue") plus a footer button on every
    page. Off a problem page the footer flags the page itself as `page-…` (`reportPageId/Label/Route`, all ids in
    `reportPageIds()`), through the same `report/<id>` events; `usage.mjs` asks about those page ids too, and the
    Walkthroughs list shows them as "page · Visualize: …". `REPORT_KINDS` gained `other`.
    Footer order: "Independent SI practice resource." (bold) → Report a problem → the AI-assistance sentence (small).
57. **Home fits one screen** (round 13): on `body.is-home` the footer is a compact two-line strip (lead + Report a problem
    + links, then the notes); `.hero-chips` hide at max-height 880 and `.week-note` at 760, so the page, footer included,
    fits 1280×720 and up (checked 1280×720, 1440×790/800, 1512×860, 1920×960; 1280×690 is 11 px over).
58. **Guide math:** `texBlock` turns newline-separated LaTeX into one display line each (environments and braces kept
    whole), so answers like "Consistent exactly when h = 5. For h = 5: …" no longer run together. `fitMath(root)` (run
    after every typeset) shrinks formulas wider than their box in key-formula cards and board lines to fit, down to
    72%, then lets them scroll. Key formulas render name / formula / note on separate lines.
59. **Visualize engine, round 13:** dragging follows the pointer exactly (`dragTo(..., fine = true)`), and on release
    `vzSettle` snaps it, lets the picture record the example (`dragEnd`), and glides there (220 ms). `vzTweenTo` for a
    picture's own moves (the playground glides to a new set's vectors; no verdict is shown mid-glide); `vzSwap` fades the
    stage and readout when a tab or set changes; the readout only re-renders when its HTML changes (so row flashes run).
    `nudge(st, k, dx, dy)` lets 3-D pictures step in their own coordinates for arrow keys. Full screen exits whenever the
    route leaves the picture. Stage text is a size up (labels 17, notes 13.5, pills 13).
60. **Visualize index by idea:** `VZ_GROUP_OF` (group → ids) is the single place that sets groups and order; cards are
    compact (minmax 196 px) with a jump row. New pictures: level, partials, arclength, order, jacobian, conservative,
    green, surface, flux, stokes (shared helpers `vzQuads`, `vzPath3`, `vzArrow3`, `vzOnFloor`, `vzInt`). Determinants and
    Null & column space were redrawn (area named inside the image + a turning arrow for orientation; colored input lines
    that each land on one dot, the dark one being Nul A). `vzPlane(cx, cy, u, uy)` takes a separate vertical scale.
61. **3-D scene labels:** an arrow lying along one of the scene's lines gets `side: true` (viz.js does it automatically),
    and the canvas renderer puts its label 65° off the arrow toward the upper side, so eigenvector labels no longer sit
    on their eigen-lines. Eigenspace names sit at 1.26× the line's half-length.
62. **Usage card:** four tiles (with this week / last week and a problems-opened meter), then four panels: weekly bars
    (every bar labelled, this week lighter), where students go (sorted), views by section (with names), top problems.

---

## Analytics (GoatCounter)

- Endpoint `https://mbocksta.goatcounter.com/count`; script in `<head>` with `no_onload: true`.
- `countRoute()` (called from `handleRoute`) sends one page-view per hash route, de-duped via
  `lastCountedPath`; a ready-poll sends the first view once the async script loads.
- Cookieless, no personal data; footer discloses it. Localhost is never counted; the desktop
  app doesn't report. **Our own test visits to the live site are counted** (e.g. `/home`,
  `/topics`, `/problem/eig-002`, `/walkthroughs/si-03`, `/problem/basis-005`, `/problem/vecmat-001`).
- **The GoatCounter code `mbocksta` is shared with Michael's Ops site**, so site-wide totals mix both. Filter the
  dashboard with `?filter=Practice+Lab` (titles) for this site. Cleanest fix: a separate GoatCounter site.
- **SI walkthroughs page cards:** "Site usage" (only `/qr` arrivals, since TOTAL would mix sites; dashboard link is
  pre-filtered) and "Reported issues" (see gotcha 35). Numbers need GoatCounter setting
  **"Allow adding visitor counts on your website"** (count feed, CORS `*`, verified on other GoatCounter
  sites). While it's off the card shows only the link and logs one CORS error per visit (leader page only).
- The full dashboard link needs **"Dashboard viewable by: Anyone"**; as of 2026-09-28 it still redirects
  to sign-in. GoatCounter forbids iframing (`frame-ancestors 'none'`), so no embed is possible.

---

## Open notes (round 15)
- Only the last practice exam is stored (pl254:examRun); "Clear" removes it. A multi-attempt history would be new work.
- Touch: picture handles claim a touch via touchstart preventDefault; verified with synthetic touches, not on a real iPhone.
- Scratchpad tests worth keeping in mind: r16/chaos.mjs (careless user), r16/neardeg.mjs (vectors close together), r15/jumps.mjs (Play discontinuities), r14/hero_pix.mjs (hero pops).

## Done (commits, newest first)

| Commit | What |
|---|---|
| _(round 19, on GitHub `dev`, NOT live)_ | Owner feedback: bugs in "Line integrals as work", side-panel text too long ("it'll intimidate students"), section descriptions too wordy; wants GitHub always updated for cloud continuation (dev branch, not live). Side panel redesigned: title, one-line subtitle (tagline), one-line "Try", controls, short readout, explanation collapsed under "The idea"; all readouts/statuses shortened; section descriptions cut to a few words. Then 26 sub-agents in three waves, each on its own copy (agents/aNN) with strict edit boundaries, merged as patches (agents/merge.sh, BRIEF.md, READY.md, MERGE_TODO.md, REVIEW_FOLLOWUPS.md): first pass over every picture group, all methods (3 problems replaced for resembling course/exam material) and the site; 4 new "Check your own work" tools (row reduce, determinant/inverse, eigen (pending), vectors) with exact fractions verified against sympy on thousands of inputs; all 95 practice problems and 74 walkthroughs re-derived (1 wrong step, 1 false T/F statement fixed; many hints that gave answers away rewritten; notation [a, b, c]); a student-perspective review and an accessibility/performance review (findings routed to agents 10/26 or REVIEW_FOLLOWUPS.md); second-pass animation agents 21–25 and runtime agent 26. Owner LIKES the home "SEVERE/COOKED/0% MASTERED" labels: keep them. sympy is at ~/anaconda3/bin/python3. |
| _(round 18, LOCAL ONLY, not pushed)_ | User: "did you read every lecture? … something from every lecture … animations are choppy … polish run … not a fan of the divergence theorem one". All 35 lectures read in full; coverage map in WORKLOG §P (every lecture now has a picture or method). **New pictures**: Row operations keep the solution (`gauss`, L4–5: three planes swing about their shared line while the solution stays; dependent system ends 0 = 0), Undoing a matrix (`inverse`, L10: A then A⁻¹ carries the plane back; singular A squashes, two inputs one output, the lecture's invertible-matrix checklist), Diagonalization (`diag`, L13/15: P⁻¹, D, P as three moves on the eigen-grid), Double integrals by slices (`fubini`, L27), Area by walking the boundary (`greenarea`, L30: ∮x dy strips), Curves in space (`spacecurve`, L18: shadow then lift), Orientable surfaces (`orient`, L33: Möbius vs band). **Divergence theorem rebuilt** (L35's own reasoning: walls → cut into boxes → pull apart (each inner wall once, one arrow out of a box into the next) → each box's net outflow → push together, inner walls cancel; 2×2×2 or 3×3×3; faces fade as they turn, so turning never pops). **New methods**: Gaussian elimination (`m-gauss`, with a swap; the planes picture runs in step), Matrix of a reflection (`m-reflect`, L8), Directional derivative (`m-dirderiv`, L21), Line integral around a square (`m-square`, L26, Green check), Surface area of a saddle (`m-surfarea`, L32), Flux through a dome by closing it (`m-dome`, L35); all sympy-verified. **Smoothness**: new tools/qa/perf.mjs (frame times, 4× CPU: all < 10 ms), flicker.mjs (rasterises each frame of Play/turn and flags pops), methflicker.mjs (same for method pictures); fixed every pop found (eigen λ tag/highlight, Green cell numbers, level plane/key, polar/transpose/compose/curves captions, curtain panels, Riemann splits and shading, powers name, projection area swinging sides, gradfield hint, Play restart fade 450/560 ms, matmul sum layout, complex arrows grow, green/wire captions, gauss scaling never through 0, pill glide keys); labels use tabular digits. QA: fuzz 0/44, chaos clean, steps all methods, monkey 67 pages, phone 0 overflow |
| _(round 17, LOCAL ONLY, not pushed)_ | **Live is held at the pre-2026-10-06 version (revert 879ec28 == 129a258) because the professor is showing it in class; push only when the user approves** (an early push of 17a leaked a bug: the projection picture's `card()` method shadowed its `card` title, so its Visualize card showed source text; fixed as `areaCard`, later removed). From the 35 course lectures (~/Desktop/linalglectures.zip; course notation [a, b, c], comp/proj, v∥/v⊥; own examples only). **Dot product and projection** rebuilt: the shadow is a wide gold band under a thin w, v · w is drawn in the scene as a rectangle standing on the shadow, |w| tall (grey and dashed when negative), dimension-style labels along the shadow (proj above, comp below), swap roles, full worked readout. **Projection onto a plane** (ℝ³) is a four-take film (plumb line onto w₁ and its shadow; same for w₂; tip to tail, the sum lands on a corner of the w₁/w₂ tiling; plumb line onto P with its square and the distance), captions per take, rests on each, camera framed per plane and drifting a few degrees during Play; planes: the floor, x + 2z = 0, and a non-orthogonal basis (sum of shadows overshoots, the drop leans, the true closest point shown). The scene is shared code (vzProjGeo / vzProjPatch / vzProjFit / vzFitCam / vzFitCamPlane / vzNames / vzProjScene) and also draws the **Distance to a plane** method, whose camera lies the plane x + y + z = 0 level like a table (axes hidden there). New pictures: **Transpose**, **Scalar line integral** (curtain), **Divergence theorem** (cube, four fields, face fluxes, drifting specks). New methods: **Matrix multiplication**, **Cofactor expansion**, **Plane through 3 points**, **Distance to a plane**. Reworked: **Green's theorem** (real field F = [−y, x²/2], cells shaded by spin, circulations add to the edge) and its method picture (no tiny circles; curl shading, polar rings filling to 3π/2); **Solving a 2×2 system** gets a column picture (x a₁ + y a₂ = b, cross-fades with the row picture); **Cross product** at true length with a turn arc (right-hand rule), legend, fading floor and a camera that follows u × v; **Divergence and curl** paddle wheel; small wins (vectors |u| and unit vector, rank–nullity tag, eigen AM/GM + repeated-λ preset, curves tangent line). Polish from a full visual audit: flux label off the key, Green key words (no ↺/↻ glyphs), critical-point surface larger, curtain camera higher, coords leg labels apart, divergence faces lighter, curtain tagline without raw ∫_C. QA tools in tools/qa/ (fuzz, chaos, neardeg, jumps, monkey, steps, shots, pages, sheet, crop, waitpages); all clean on the local build |
| _(round 15i)_ | User-reported: Subspace playground opens on condition 1 (was 2); every toggle dissolves the picture (nothing spawns in); Linear independence skips the v₃ construction when it needs huge multiples (says so instead); Coordinates walk labels ("2b₁", "1b₂") sit beside their legs, away from the basis names, and fade in; Path independence W labels keep their side near a straight path; ℝ³ subspace planes use a closer camera and show the line every cv lies on, cv's label beside its tip; Green's method picture tidied (spins on two rings inside C, ∂Q/∂x − ∂P/∂y titles). Exam Mode: "Clear" on the last-exam card with an inline "are you sure" (Clear it / Keep it) |
| _(round 15h)_ | QoL pass: on/off settings are site-styled switches; sliders fill red behind the thumb with a hover halo; Play buttons have play/pause icons and a fixed width (methods too, with a replay icon); usage-chart tooltip follows the pointer, no native duplicate, no flicker between bars (bars let the pointer through), hides on scroll/route change. iPhone scrolling: page background moved off `background-attachment: fixed` onto a fixed layer; solid (unblurred) top bar and walkthrough outline on phones; height-based home layout rules limited to desktop widths (Safari's shrinking toolbar was resizing the home page mid-scroll); hero pauses off screen; tile replays skip mid-scroll; on Visualize pictures a finger only drags when it lands on a handle, otherwise the page scrolls (was touch-action: none on the whole picture). Perf: Visualize index thumbnails cached and drawn a few per frame (230 ms long task gone at 4× CPU) |
| _(round 15g)_ | Vectors dragged close together (user report): tip labels whose names differ only by a number (Ae₁/Ae₂, v₁/v₂) shared one side memory and jittered every frame; each label now has its own. Labels never leave the picture (clamped at the edge); tip labels keep a full line apart; Span and Coordinates grids fade as the two vectors close in on one direction (no tangle); Coordinates snaps a nearly-in-line basis onto the line on release and treats < 1° as not a basis (no million-sized coordinates mid-drag) with a "nearly in line" note; Independence moves its area label beside a thin parallelogram; Projection's b capped at 3.1 so Play can't swing it off the picture. New tests in the scratchpad: r16/neardeg.mjs (every handle onto / 3 px / 10 px / nearly in line with every other, plus labels-still-moving-at-rest) |
| _(round 15f)_ | Methods: the whole solution builds up on the board (no summaries, nothing removed; the board pans down gently and pauses its pan for 4 s if you scroll back; on phones the page follows the newest line while playing), quicker step-to-step (reason, then math within ~1.3–2.2 s), 28–58 s per method at Normal (Quick ×0.7, Slow ×1.7). Bug guard: any drag/settle/nudge that would leave a handle off the picture is not taken (vzSafeDrag); gradient point kept far enough in for its ring; coords handles stop above the key; pausing Play glides to the nearest step (no c = −2.49, no half-split grids); coefficients of 1 are written v, not 1v. New user-like chaos test (scratchpad r16/chaos.mjs: real mouse drags off-stage/onto origin/onto each other, in-between slider values, pause mid-play, chips mid-glide) |
| _(round 15e)_ | Methods re-paced and re-animated like a worked-example video (user: matrices popping and the left-to-right wipe felt aggressive; pacing needs reading time): each step opens with its title and reason (≈240 ms a word, 3.2–8 s), then each line of math fades in while its space opens smoothly and stays for as long as it takes to read (1.5 s + 95 ms a symbol, 2.4–6.2 s; a 0.9 s beat after the last line); finished steps ease into one-line summaries; no wipes or pops; the problem stays pinned at the top and a full board pans down gently instead of folding. A method runs 68–127 s at Normal (Quick ×0.7, Slow ×1.4) |
| _(round 15d)_ | Riemann hero: 1 box → 3 × 3 → 6 × 6 → 12 × 12 → surface, then sink-and-rise reset (user's wording: "1, 3x3, 6x6, 12x12"); phone keys as text under each picture; method pictures that keep moving (picLive: Green's spins turn, a bead rides the wire in Work, flow specks cross the flux triangle) |
| _(round 15c)_ | Gradient and directional derivative rebuilt: height shading, quiet gold level curves, a slope ring around the point (red and thick where that direction climbs, grey where it falls, switching exactly on the level curve), solid u, legend; extrema and subspace methods no longer hint at answers in their opening picture |
| _(round 15b)_ | Riemann hero rebuilt as 1 box → 3 × 3 → 9 × 9 → surface, and the loop ends with its own move (boxes sink into the floor in a wave, one box rises) instead of running backwards; splits dissolve a copy of the old boxes (pixel scan: 0 pops). Labels never teleport on the live picture (vzGlide: a jump glides over ~0.2 s; tip labels and det's area label keep their side unless the other is clearly better); compose pill width glides; tabular digits in readouts |
| _(round 15a)_ | Play is continuous everywhere: whole-number sliders morph instead of stepping (Green's cells, Riemann boxes and arc-length corners slide in, polar cell slides ring to ring; snapped sliders glide), shorter holds; picture-to-picture and preset switches dissolve; methods play like a video (≈35% shorter pacing, lines write in, steps crossfade, the picture dissolves between steps and no longer restarts every line, clickable progress line on the board); gradient-field builder rebuilt (height shading, 11×8 field growing as one wave); flux shows a countable grid of flow lines; sphere closed; order-of-integration labels never say a curve twice; pictures grow to fill the screen height on large displays, method text scales with the board; legends added (fields, work, matrix, powers); thumbnails drop unreadable notes; 3-D sketches reframed (eig-004, surfstokes-001/002, `center` option), drag hint fades after 4 s; usage dashboard math-size fix; tools/cdp.mjs now deletes its Chrome profile (had filled the disk) |
| _(round 14d)_ | Coverage: new pictures for matrix multiplication as composition (AB vs BA), coordinates in a basis, the chain rule along a path; new methods for absolute extrema on a closed triangle and volume in cylindrical coordinates (original problems) |
| _(round 14c)_ | Methods, step by step (new Visualize group, 12 slow worked animations on ORIGINAL problems; never past-exam problems): null & column space, subspace proofs, combination vs span vs basis, real eigen, complex eigen (rotation + A⁴ = −4I), inverse via [A\|I], diagonalize + long run (bike stations), helix wire mass, work via a potential, flux through a first-octant triangle, switch the order, Green's theorem. Board writes line by line, finished steps fold into summaries, reason under each step, synced picture, outline + Back/Play/Next + speed, keyboard ←/→/space, floating controls on phones. All math sympy-verified. |
| _(round 14b)_ | Visualize quality push: picture pages fit one screen (footer hidden, prev/next in the top bar, panel scrolls inside only if it must); Play rewritten (progress sliders fade-restart, morphs sweep with rests at the ends, rests at special values e.g. eigenvectors); editable matrix control; Eigenvectors rests on each eigen-line with a λ tag; Subspace playground rebuilt (check each condition or all three; counterexamples glide in; 3-D vectors stay inside W); Partial derivatives shows each slice flat with slope triangles; Change of variables: presets switch maps instead of gliding through others, cell grows about its centre; new Building a gradient field picture; draggable gradient point/direction and projection b/line |
| _(round 14a)_ | Polish check: all 62 Warm-up/Core/Conceptual solutions and all 74 SI-guide problems step-verified (no errors); Visualize readouts checked against closed forms + fuzzed (exact π/9, 1/n², fractions for repeating decimals, signed products, clean multiples on release, label de-collision); tangent-plane sign fix; Riemann hero split/merge crossfade; SW revalidates; footer Report a problem is a plain link |
| _(round 13)_ | Home fits one screen; quiet Report button; full-screen exit fix; guide math lines and fitted formulas; Visualize: smooth drag + glides, concept groups, compact cards, new Determinants and Null & column space, 10 new calculus pictures; polished usage dashboard; 3-D eigen labels off their lines |
| _(round 12b)_ | Visualize expanded: Subspace playground (ℝ² and ℝ³, three tests, counterexample vs examples), draggable Span, Linear independence, Determinants, Null & column space, Adding and scaling vectors; transformations get a before/after slider and draggable columns; concept-card index; full screen. Footer leads with "Independent SI practice resource" and "Report a problem" (page-level reports reach the leader's list) |
| `f81e150` | SI board sketches rebuilt on the sketch kit (walk.js, all 39 geometric specs, larger labels); exact values (5/3, √2/2, 0 ≤ θ ≤ 2π) in the guides' tables; Riemann hero is the first-visit picture and loops without emptying; new circulation hero; polar caption dropped; phone tiles replay one at a time |
| `d0c0a77` | Your progress card redesigned (smaller ring; full-width "Continue where you left off" row, title on two lines); softer week chips; no hover underline on link buttons, chips or section-map segments |
| `247243a` | Usage + reports load from a GitHub-Action snapshot (usage-data branch), so they show behind ad blockers such as Brave Shields |
| `4adea10` | Walkthroughs: "Where students go" chart; Reported issues listed in-site with kinds and Mark fixed; no GoatCounter buttons needed |
| `95056ff` | Link-preview card uses the Riemann boxes (og-image.png?v=2); rref-005 redrawn as two parallel lines; a − b is an arrow; W plane refitted; 2-D eigen pictures cleaned (skEigen2: solid lines, v inside Av, no blur); 7 eigen 3-D sketches → clean interactive scenes; transdet-005 tidied; usage charts verified on real data |
| `ea52ef9` | Publish check: every sketch reviewed for clarity (rref-004/005, basis-003, eig-007/010, transdet-003/006, diagprojcross-004/005/006, curvgradopt-004/005, vecfieldline-001/003 fixed; strip pictures rebuilt; 10 vector sketches → interactive 3-D); 3-D label fixes; text contrast raised site-wide (ink-mute/faint, gold text, heat-3 tile); hero text halos; Riemann hero seamless refinement; gradient projection redrawn; complex-eigen picture removed; Visualize blurbs typeset; Riemann plane explained; Exam-review link fixed; MathJax memory leak fixed; 3-D scenes sleep off screen; `[hidden]` fix (Clear status); usage charts; all 95 answers re-derived with sympy |
| `6448ec8` | Visualize: Play on every slider (progress/wrap/sweep), exact matrix values + brackets, systems label by clearance search, projection/gradient/critical/fields reworked, simple complex-eigenvalue picture, progress sliders start at the left; polar hero back to the stretch (no numbers); ascent hero on a tilted ridge; hero clock smoothing + cached DOM writes; reflow-free phone tile replay; answers removed from all sketches and 3-D scenes; "(c)" ligature fix |
| `9ea7016` | Visualize tab (15 interactive pictures); SI session guide + Teach mode with scripts for all 22 sessions; per-problem sketches for all 95 problems (kit + atlas + 18 per-problem 3-D scenes); typeset hero formulas; polar hero + visual as two planes; ascent/projection/eigen hero fixes; glyphs 06/09; phone tile replay; exam run with clock; in-site Report issue + Walkthroughs card; About credit; Skip opens the whole solution; si04/si12 data fixes |
| `ac2338c` | Guided solutions, lecture-based exams, offline mode (sw.js), cleaner 3D scenes |
| `07b54e3` | Rotating hero (4 new course animations + original, per visit / click); calmer section-header art (`SECTION_ART`); tile glyphs 3 & 4 redrawn, dotted lines; QR → home (`?qr` counted as `/qr`), `#/si` landing removed; This-week note |
| `00954ab` | Design polish (tile glyphs, header art, Got-it moment + section map, empty states); instant route scroll + scroll memory + in-place status; mobile overflow fix; walkthrough prose cleanup (115 strings) + renderer guards; This-week strip; `#/si` landing + new QR; og tags + `og-image.png`; SI usage card; `VISUAL_OVERRIDES` sketch fixes |
| `1d6034f` | Math rendering cleanup: 57 plain-text math → LaTeX; paragraph breaks; MathJax color extension; typeset-failure recovery; walkthrough fixes (si-02/03/04/05/06–09/15/18/20) |
| `da4e2a9` | GoatCounter analytics + footer privacy note |
| `003544e` | Removed student-facing "Common Mistakes" (data kept, unrendered; walkthrough version kept) |
| `a2f4982` | rref-001 `[A∣b]` bracket eaten by `\[` |
| `2ec7caf` | Resume-link LaTeX truncation, storage data-loss, QR overlap |
| `0716fcd` | Undelimited LaTeX in 7 Section-2 problems |

---

## Next / open items

- GoatCounter: create a separate site for the Practice Lab (the code is shared with the Ops site), or at least turn on
  "Allow adding visitor counts" so the Walkthroughs usage + reported-issues cards fill in.
- Visualize tab labels still use Fraunces text; they could move to the SK_TEX atlas like the sketches.
- `commonMistakes` data still sits unrendered in the problem JSON: purge if the feature is gone for good.
- Optional: vendor Google Fonts for fully offline typography.
