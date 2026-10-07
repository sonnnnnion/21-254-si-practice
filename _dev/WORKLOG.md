# Work log / checklist (not published) — Round 5, started 2026-09-29

## A. Finish round 4 (local, unpushed)
- [x] Ascent hero: no jitter at hilltop
- [x] Heroes 5-9 in rotation (10 total)
- [x] Attempt box removed
- [x] Guided solution: tested desktop/mobile/keyboard/memory; print rules added
- [x] Footer notices visible on home at every size
- [x] Exam Mode by professor's lecture ranges (1-9, 10-17, 18-26, 27-35, final = all)
- [x] Lecture tags on problems (page, rows, exam set)
- [x] Copy-link button on problems
- [x] Offline support (service worker, network-first page/data)
- [x] eig-006 gets a complex-eigenvalue sketch (was the generic eigenvector one)
## B. Fix glitches in 3D problem visuals (Viz3D) — DONE (layers, segment sorting, marks bias, time-based spin, labels)
## C. Visualizations tab — DONE: 15 pictures (#/visualize), layered drawing, sticky stage on phones, verified desktop/phone/interactions
## D. SI walkthroughs redesign — DONE: teach scripts for all 22 sessions merged (tools/teach/siNN.py + merge_teach.py with validation); CDP audit 0 merror/red/raw/errs on page + every Teach slide; notation renderer fix; data fixes si04 LaTeX, si12-p3 eigenvector, si12/si13 notation
## E. Usage metrics report — numbers gathered (public dashboard, filter=Practice Lab): 303 visits since Aug 7, 283 in Sept; NOTE: GoatCounter code shared with the Ops site; usage card TOTAL would mix sites
## F. Full-site QA, HANDOFF, push — DONE (9ea7016)

## G. Round 6 requests (2026-09-29, mid-turn)
- [x] G1 Heroes (DONE: ascent smooth starts; polar two-plane redesign; formulas typeset via tools/hero_tex.mjs; projection b−p arrow + swing + labels; eigen intro): audit all 10 over full timeline; ascent end-arrow; polar: separate (r,θ) plane from xy region + verify area math; riemann "∬_R f dA" label legibility; projection: b − p gets an arrowhead
- [x] G2 Section glyphs (DONE: 06 diagonal matrix, 09 polar grid cell; make_glyphs.py) 06 + 09 redesign (legible at tile scale); tile art too if same motif
- [x] G3 Phone (DONE: .replay wave, 2.2s then every 9s) (no hover): tiles replay their draw-in every so often while visible
- [x] G4 Exam page: remove lecture cover card; Generate → real exam run (Q1 first, corner stopwatch, red at 50:00, → / Next, finish summary, persists)
- [x] G5 Skip to solution = reveal all steps + answer immediately
- [x] G6 Report issue: in-site report (tag on problem) + visible to Michael on Walkthroughs page; Send feedback keeps email; update About text that mentions Report issue
- [x] G7 About this resource: "Resource created by Michael Bockstaller. You can reach out with more specific feedback at mbocksta@andrew.cmu.edu"
- [x] G8 Problem visual sketches (DONE: tools/sketches/*.js kit + 75 per-problem 2D sketches + 18 per-problem Viz3D scenes; MathJax glyph atlas via tools/sketch_tex.mjs; build.sh; problems_audit.mjs 95/95 clean): mass 2D improvement (labels/subscripts, arrowheads, perspective, per-problem uniqueness); improve interactive 3D where needed
- [x] G9 then F: usage card fixed; QA done; HANDOFF updated; pushed 9ea7016 (Pages built, live == source, live smoke test clean) (usage card fix, full QA, HANDOFF, push, report)

## H. Round 7 notes (2026-09-29)
- [x] H1 Visualize "Solving a 2×2 system": point label placed by a clearance search (never on a line), legend with line swatches
- [x] H2 Visualize "A matrix is a transformation": exact values (√2/2, √3/2, √2, √3) on sliders and readout; Rotate 45° exact; brackets instead of det bars
- [x] H3 Play on every slider; one at a time; progress sliders run → pause → glide back; 360° angles keep turning; others sweep back and forth, easing at the ends
- [x] H4 Visualize index cards: no underline on hover
- [x] H5 Visualize "Projection": dropped the stacked û arrow; "line along û" label; "proj" on the side away from b; label halos
- [x] H6 Progress sliders start at the left (powers k 0, spiral k 1, curves t 0, work 0°, Riemann n 1, polar 0%); the index cards keep an interesting frame (thumb)
- [x] H7 Complex eigenvalues redrawn: one step before (grey) vs after (red), φ arc, faint trail, legend; smooth between steps
- [x] H8 Gradient: shadow of ∇f on u is a gold bar beside u (no arrowhead blob), labels kept apart, point range kept in frame
- [x] H9 Critical points: real subscripts in the readout; shaded round surface (depth-sorted, reused paths) that turns smoothly
- [x] H10 Divergence & curl: 36 particles seeded in the dashed circle with short fading trails; 9×5 arrow grid
- [x] H11 Riemann hero: code unchanged since the fluid version; smoothed the hero clock (hitches slow it, never jump), cached no-op DOM writes, removed the phone tile replay's forced reflows
- [x] H12 Ascent hero: main hill is now a tilted ridge; four starts chosen by a scan so every path bends 60–80° with the hill and never turns sharply
- [x] H13 Answers removed from all 95 sketches + 3-D scenes: titles/captions give the method, formulas the setup, labels name things (∗ / □ / ? for values to find); automated leak check = 0
- [x] H14 "(c)" → ©: Manrope's standard ligatures ('liga'); body now has font-variant-ligatures: no-common-ligatures no-contextual
- [x] H15 Full QA: site_qa 17 routes × 2 widths clean, problems_audit 95/95 at 1280 and 375, SI guides 22/22, all 9 heroes, all 15 Visualize pages with Play, changed 3-D scenes; polar hero has no numbers (user request)

## I. Publish check before emailing the instructor (2026-09-30)
- [x] I1 Visual clarity: every sketch (95), 3-D scene (18), Visualize picture (15) and hero (9) judged as a student would see it; fix the confusing ones (user flagged rref-004 column-space plane, rref-005 null-space lines)
- [x] I2 Math check: final answers recomputed (sympy) for every computational problem; sketch geometry matches problem data; Visualize readouts
- [x] I3 Bug check: flows (Got it / Review, exam run, report, walkthroughs + Teach, shortcuts, search/filter, back/forward, offline), console, links
- [x] I4 Performance: load (throttled), long tasks, page weight, idle CPU (no stray rAF), heap after many routes
- [x] I5 Design: every route at desktop + phone, consistency pass
- [x] I6 GoatCounter access (public dashboard works; counter feed needs "Allow adding visitor counts")
- [x] I7 Email draft to the instructor
- [x] I8 Region/strip visuals (double integrals, Green, polar sectors) redrawn as developed pictures: a clear representative strip whose ends sit on the boundary curves, labeled ends, dx/dy marker, clean split line (user: "the dy strips are kinda gross")
- [x] I9 Text readability everywhere: hero subtitle/caption sit on contours with no halo (user screenshot); halo + darker small text in heroes, check sketches, Visualize, 3-D labels, UI contrast
- [x] J1 Riemann hero transitions fluid (user's favourite): no ghost layers; each box splits into 4 and eases to its own height
- [x] J2 Visualize gradient: replace the gold bar with a clean projection (dashed drop to the u line, gold arrow along it)
- [x] J3 Remove the complex-eigenvalue Visualize picture (not taught to that depth in lectures)
- [x] J4 Riemann Visualize "Tilted plane" error = 0: explain (midpoint boxes are exact for a plane); fix x_i, y_j subscripts in the readout
- [x] J5 Visualize blurbs typeset as math (F = (ax − by + sx, …), f = ax² + bxy + cy², …)
- [x] J6 "Start Exam 1 review →" goes to the home page (bug)
- [x] J7 Vector visual ideas as simple as possible: pure-vector 3-D sketches become interactive 3-D scenes (the style the user likes)
- [x] J8 GoatCounter usage charts in the Walkthroughs usage card
- [x] J9 Email: ask for a meeting to demo the site; include usage statistics

## K. Round 12 (2026-09-30)
- [x] K1 Riemann boxes are the first-visit hero; later visits rotate
- [x] K2 SI walkthrough board sketches readable: rebuilt on the sketch kit (tools/sketches/walk.js), labels a size up
- [x] K3 Exact values stay exact (5/3, √2/2, π): data tables, bounds, guide text without "≈" glosses
- [x] K4 Polar hero caption removed (awkward on phones); phone section tiles replay one at a time
- [x] K5 Circulation hero redeveloped (flat, flowing field, F and dr at a point, C filling in); Riemann loop merges back instead of emptying
- [x] K6 Visualize expanded: Subspace playground (ℝ², ℝ³), Span, Linear independence, Determinants, Null & column space, Adding and scaling vectors; draggable vectors; concept-card index; full screen
- [x] K7 Footer: "Independent SI practice resource" + "Report a problem" lead; AI disclosure kept, secondary; page-level reports reach the leader's list

## L. Round 13 (2026-09-30)
- [x] L1 Home page fits one screen (footer included); quiet neutral Report a problem button
- [x] L2 Full screen no longer traps you in Visualize
- [x] L3 Guide answers no longer run together or off the edge; key formulas fit their cards
- [x] L4 Visualize index organized by idea, compact cards, jump row
- [x] L5 Playgrounds smooth: free dragging that glides to clean values, tweened set changes, fades, flashing checklist rows
- [x] L6 Determinants and Null & column space redesigned for clarity; every picture's text a size up
- [x] L7 Ten new calculus pictures: level curves, partials + tangent plane, arc length, order of integration, change of variables, path independence, Green's theorem, parametric surfaces, flux, Stokes
- [x] L8 Site usage card rebuilt as a polished dashboard
- [x] L9 3-D eigen scenes: labels beside their lines, not on them

## M. Round 14 (2026-09-30): polish check, then a Visualize quality push
- [x] M1 Math: 62 Warm-up/Core/Conceptual solutions + 74 SI-guide problems step-verified; Visualize readouts vs closed forms; fuzz of every picture
- [x] M2 Exact values in Visualize (π/9, 1/n², 2/3), signed products (−0.25)·1, combos 1.5v₁ − 0.5v₂, clean multiples on release
- [x] M3 Hero seams: pixel-diff scan of all 10 heroes; Riemann split/merge now crossfades
- [x] M4 Service worker revalidates page + data; footer Report a problem is a plain grey link
- [x] M5 Visualize quality push (gradient-field builder, subspace checks, partials, change of variables, one-screen pages, Play/rewind, eigen rests)
- [x] M6 Step-by-step method animations (12; original problems only; never exam problems)
- [x] M7 A picture for every big lecture concept (composition, coordinates, chain rule, extrema, cylindrical); polish check: monkey test on all 47 pages, leak laps (nodes/listeners flat), 60 fps under 4× throttle, real-time pacing, phone pass

## N. Round 15 (2026-10-01): smooth Play, video-like methods, look-and-feel pass
- [x] N1 Fresh-eyes screenshot review of every page, all 47 Visualize pages, all 35 3-D sketches
- [x] N2 Play never steps: whole-number sliders morph (Green, Riemann, arc length, polar), snapped sliders glide, shorter holds; switches dissolve
- [x] N3 Methods like a video: faster pacing, write-in lines, crossfading steps and pictures, clickable progress line
- [x] N4 Gradient-field builder rebuilt; flux flow grid; sphere closed; label/legend fixes; bigger pictures on large screens


## O. Round 17 (2026-10-06): teaching value, using the 35 course lectures (linalglectures.zip)
Source: ~/Desktop/linalglectures.zip (typed lectures 1–35). Own examples only, never the lecture's.
Course notation to match: vectors in brackets [a, b, c]; |v| for length; comp_w(v), proj_w(v), v∥, v⊥, proj_W(v).
QA tools now live in tools/qa/ (README there); deploy clone: gh repo clone sonnnnnion/21-254-si-practice <scratch>/repo.
- [x] A projection rebuilt (ℝ²): dot product as "amount of v along w × |w|" (L16 work-on-a-ramp idea), comp (scalar) vs proj (vector), v∥ + v⊥, swap roles, full worked equation   [L1, L16]
- [x] B projplane (new, ℝ³): proj_W(v) = proj_w1(v) + proj_w2(v), v⊥, distance, full equation; non-orthogonal basis preset shows why orthogonal matters   [L16]
- [x] C m-planedist (new method): distance from a point to the plane x + y + z = 0 by projection   [L16]
- [x] D green rebuilt (local): real field, curl shading, each cell's circulation adds up to ∮_C   [L30]
- [x] E m-green picture rebuilt (local): field arrows, curl shading 3r², polar rings filling to 3π/2 (no tiny circles)   [L30]
- [x] F curtain (new; per-curve views checked): ∫_C f ds as the area of a curtain above C   [L25]
- [x] G transpose (new): rows become columns; symmetric / skew / triangular   [L3]
- [x] H m-matmul (new method): row × column, sizes   [L2]
- [x] I m-det3 (new method): cofactor expansion of a 3×3   [L9]
- [x] J m-plane3 (new method): plane through three points, area from the cross product   [L17]
- [ ] K Green's: area by walking the boundary / closing an open curve   [L30] (if time)
- [x] N teaching review + full visual audit (user, 10-06: "your R3 projection picture was really nasty ... everything holds to the same polished standard"): projplane rebuilt as a four-take film on a shared scene (also drives m-planedist, plane-aligned camera); dot product: shadow band visible, v · w as an in-scene rectangle; systems column picture; cross product true length + turn arc + legend; flux/green/critical/curtain/coords/divthm polish; every picture and method shot and reviewed (scratch r17/all*, r17/mth*)
- [x] L divergence theorem picture (divthm: cube, 4 fields, face fluxes, specks)   [L35] (if time)
- [x] M small wins (+ paddle wheel in fields): unit vector + |v| in vectors [L1]; rank–nullity in nullcol [L7]; AM/GM + spectral notes in eigen [L12, L14]; tangent line in curves [L18]

**Status 2026-10-06 (later):** A–J, L–N done locally; K (Green's area by walking the boundary) not started. QA clean (fuzz 0/37, chaos, neardeg, steps, phone). Waiting for the user's OK to push.

**Earlier status 2026-10-06 (usage limit hit):** LIVE was rolled back to the pre-10-06 version (revert 879ec28 == 129a258) because the professor is showing it in class. Do NOT push until the user approves. Local github-upload/ has A–F (A–C were briefly live, then reverted). Fixed locally: the projection picture's `card()` method shadowed its `card` title, so the Visualize index showed the method's source text (renamed to areaCard). Next: finish F check, then G–M, run tools/qa (fuzz, chaos, neardeg, steps, monkey), then ask before pushing.

## P. Round 18 (2026-10-06, user: "did you read every lecture? ... something from every lecture / topic ... animations are choppy ... polish run ... publishable ... not a fan of the divergence theorem one ... think logically based on the lecture notes")
All 35 lectures read in full (scratch r17/lal/txt). Coverage map (✓ = already has a picture or method):
- L1 vectors ✓ vectors · L2 matrix product ✓ m-matmul, compose · L3 transpose/special ✓ transpose
- L4–L5 systems, RREF, Gaussian elimination: [x] NEW gauss picture (not a method) (3×3 by elimination) + picture of three planes whose meeting point never moves while row ops reshape them
- L6 span/subspace/Col/Nul ✓ · L7 independence/basis ✓ · L9 determinants ✓ det, m-det3
- L8 linear maps: [x] NEW m-reflect (matrix of a reflection from the basis {on the line, across it})
- L10 inverses: [x] NEW inverse picture "Undo it": A then A⁻¹; singular A folds the plane (two inputs, one output); live invertible-matrix checklist
- L11–L12 eigen ✓ eigen, powers, m-eigen · L13/L15 eigenbasis + diagonalization: [x] NEW diag picture A = PDP⁻¹ in three moves
- L14 complex: [ ] NEW picture complex multiplication = turn and stretch (+ m-complex ✓)
- L16 projections ✓ · L17 cross/planes ✓ · L18 curves ✓ + [x] NEW spacecurve: cylinder ∩ plane, lifted circle
- L19 level ✓ · L20 partials ✓ · L21 gradient ✓ chain ✓ + [x] NEW m-dirderiv
- L22 critical ✓ m-extrema ✓ · L23–24 fields ✓ · L25 line integrals ✓ · L26 path independence ✓ + [x] NEW m-square (piecewise ∮ around a square)
- L27 double integrals: [x] NEW fubini volume by slices · L28 order ✓ m-switch ✓ · L29 polar/jacobian ✓
- L30 Green ✓ + [x] NEW greenarea: area by walking the boundary (∮ x dy strips)
- L31 surfaces ✓ · L32 [x] NEW m-surfarea · L33 flux ✓ + [x] NEW orient (Möbius vs band)
- L34 Stokes ✓ · L35 [x] divthm REDESIGNED (cut into boxes, inner walls cancel; source density), [x] NEW m-dome (close a dome with a disk), [ ] NEW m-triple (mass of a solid)
Smoothness: [x] tools/qa/perf.mjs (real frame times at 4× CPU) on every picture; fix slow ones; [x] flicker.mjs (rasterised pop detector) on every picture + methflicker.mjs on every method: pops fixed
