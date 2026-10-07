# Shared fixes to do at merge (reported by agents; outside their boundaries)
- [ ] Play loop reset (vzPlayStep "out"): new first frame appears at full strength under the fading ghost, so shapes that
      weren't in the old frame pop (riemann n=1 box). Do a true cross-dissolve: ghost fades out AND the new frame fades in
      (vzFade 0 → 1 over ~600 ms via the "in" phase). (a05)
- [ ] vzPreset stops Play (vzSetPlay(null)) even for selector-only presets; keep playing. (a06)
- [ ] Preset chips never show which one is active: engine-level sync (mark the preset whose values match the state). (a06)
- [ ] vzNote / on-picture captions ~8 px tall on phones: scale up at narrow widths. (a06, a05)
- [ ] vzProjScene: labels ignore the dashed w₁/w₂ lines ("w₁" reads as "−w₁"); edge check assumes 600-px width (scale by opt.W). (a08)
- [ ] stShow: only the current step's lines are fitted (stFit); jumping ahead from the outline leaves earlier lines unfitted: fit every j <= k. (a08)
- [ ] Caption font: "|" looks like "l" in Manrope (|n| reads "Inl"); use serif for |…| in notes or avoid. (a08)
- [ ] (sent to a10) .sg-a span / .sgt-a span CSS styles all spans in walkthrough answers as the small gold label → target only the label span. (a18)
- [ ] Walkthrough session 1 uses ⟨a, b⟩ notation; course uses [a, b]; board sketches draw ⟨⟩ themselves (visualSpec labels pre-rendered). Decide later. (a18)
- [ ] vzGaussScene coincident-plane names, axis-name avoidance; vzGlyph ±0.5 → ±½ (sent to a21). (a02)
- [ ] (sent to a10) phone: ~132 display equations in problem steps overflow at 390 px. (a17)
- [ ] Problem pages never show "common mistakes" although the section text promises them: consider a collapsed "Common mistakes" on the solution. (a17)
- [ ] Notation: data/ sections 7–10 now use [a,b,c] (a17). Walkthroughs sessions 1 and 16–22 and a few index.html concept panels/sketches still use ⟨⟩ or ( ): convert for consistency in a follow-up. (a17, a18)
- [ ] Phone: problem-page math (step column ~272 px, final answer ~228 px) scrolls sideways: add those blocks to fitMath (shrink to ≥72%). (a16; overlaps a17's note, sent to a10)
- [ ] Stray "." after inline math wraps onto its own line site-wide: keep punctuation with the math (no-break wrapper). (a16)
- [ ] (sent to a26) vzGlide: when a label's target jumps during a running glide it snaps; restart the glide from the current position. (a01)
- [ ] (sent to a26) vzPreset: dissolve on any boolean change too (e.g. span "two"). (a01)
- [ ] vzAxes3: axis names at 1.08×length can land on the key; clamp them above y ≈ 410 (all 3-D pictures). (a04)
- [ ] cdp.mjs port collisions between parallel runs: FIXED by the lead (port 0 + DevToolsActivePort, mkdtemp profile). (a15)
- [ ] Shared `type: "matrix"` control: number inputs + parseFloat can't take 2/3; add a fraction-capable text input (tools built their own). (a11)
- [ ] film.mjs / flicker.mjs assume a Play slider; tools need a step-through filmstrip mode. (a11)
- [ ] (sent to a26) method pictures: content outside the 360×460 viewBox shows in the letterbox; clip #stPicG/#stPicOld. (a09)
- [ ] tool-det keeps a small <style> (.tdet-*) inside its panelTop: move to shared CSS at merge if preferred. (a12)
- [ ] vzShort: near-integers with float error (4.99999995) become unreduced fractions like "15/3": test near-integer with the same tolerance, reduce p/q. (a03)
- [ ] Manrope "|" reads as "I"/"l" in keys and taglines ("Iu × vI"): serif fallback for the bar character (CSS or vzKey/vzNote). (a03, a08)
- [ ] vzTipLabels doesn't avoid other arrows (shorter vector's name on a longer one's shaft). (a03)
- [ ] chaos.mjs line 25 can crash when the page isn't ready: skip the step if the read fails. (a03)
- [ ] chaos.mjs: picks targets by offsetParent only, can click chips under the sticky nav → elementFromPoint check. (a14)
- [ ] flicker/methflicker serialize the SVG and can't see vzSwap's ghost fade (it's a WAAPI animation), so dissolves look like pops: account for the ghost's current opacity. (a14, a07, a04)

## Next-session list from the second-pass agents (not done yet)
### methods (a25 did only m-subspace, m-span, m-reflect; added stLineT/stLines helpers so a picture can follow its board line)
- Picture shows the answer before the board says it (use stLines): m-det3 (−16), m-markov (100v₁ lines), m-eigen, m-plane3, m-square, m-surfarea, m-wire, m-flux, m-extrema, m-dirderiv, m-dome.
- Pops: m-plane3 "n = …" and PQ/PR labels; m-square walker dot jumps back every 2.2 s (fade at each lap).
- Overlaps: m-plane3 P label on z-axis label; m-markov counts on dashed lines; m-gauss x label touches R₃; m-flux/m-dome axis labels clipped at right.
- m-switch last step freezes at ~99% (sweep outlasts picDur 3.2 s): set picDur 4200.
- m-cylinder lid path has two fill attributes (vzPath3 adds fill="none") → blank in SVG-as-image; draw the path directly.
- m-eigen step 5 caption still "λ = 4 and λ = −1".
- Runtime (a26): keep redrawing for picDur after each LINE change and hand pic() the line's time (then stLineT isn't needed); a sliver of board shows above the sticky "The problem" header.
### matrices/vectors (a21 did gauss + vzGaussScene + vzGlyph only)
- compose: Rotate 90° interpolates linearly (shrinks to 71% mid-way) → rotate by angle; chip click jumps without dissolve (vzSwap + delayed tween); picture could be bigger.
- transpose: easing applied twice → e = (u + vzEase(u))/2.
- inverse: top-left caption cross-fade overlaps (fade out then in).
- det/matrix: drag rings pop at the end of the slide (fade in t .9→1).
- vectors group (vzClearTips/vzStack) and nullcol: second pass not done.
### dot/eigen/curves/tools (a22 fixed only vzProjScene w-line obstacles, vzNames key width, projplane sum colour)
- projplane: at build ≈ .5 proj_w₂(v) name overlaps "w₂" (lower the side-memory bonus while fading in); "closest point" crosses v's arrow; P's name avoids a fixed 50 px top (use opt.top).
- projection: "comp = …" overlaps proj_w(v) near 190° and 75°; θ overlaps proj at small angles; key always shows red area even when it's grey (v·w < 0). (re-check on final code)
- eigen: λ tag digits tick as v arrives (2.18 → 2.2): show the exact eigenvalue.
- diag: x's arrow close to v₁'s red; names v → e → 2e change in one frame.
- powers: swing done in ~2 of 14 steps, then idle.
- spacecurve: r(t)/r′(t) overlap axis letters at many angles; segment: key overlaps "x" at yaw −90, r′(t) overlaps "q (t = 1)".
- Second pass not done: cross, tool-rref, tool-det, tool-vec, tool-eigen. a22's scripts: /private/tmp/claude-501/agents/a22/bin/
### fields/surfaces (a24 fixed green cell numbers flying, divthm minus sign, gradfield pins off the key)
- divthm: step 2 inner-wall fills read as a second cube (lower opacity); step 5 inner walls pile into a dark block (fade their tint t .66–.77).
- gradfield: bottom field arrows reach the key; top-right pin crowds its label → vzPlane(300, 212, 78) and put the label beside the arrow when past-the-tip is off-picture.
- fields: paddle wheel 0.9·b vs fluid 0.5·b: use one speed (~0.7).
- curtain: y-axis name on the curtain (parabola) → longer axes (~3.3); "C" can land on the curtain when turned.
- conservative: the two "W =" labels glide through each other when the bend crosses 0 → cross-fade.
- surface: sphere→flat happens in ~1 s (double easing) → play .35 → ~.25.
- vzGlide keys labels by on-screen order: labels fly when their count changes; let vzLabel take an explicit key (a26).
- Not reviewed in pass 2: orient, flux, stokes, phone width of this group.

## Overnight wave 4 (2026-10-07, b1–b4 + lead_fixes2) — merged in checkpoint 2
Done: engine loop-restart cross-dissolve (plain opacity, tools see it), presets keep Play + dissolve on toggles, active
preset chip outline, method-picture soft edge fade, vzGlide restart, phone captions 15.5 px, vzShort near-integers,
BarFix font (| ‖ ∥ ∣ from Georgia/STIX), vzAxes3 clamp; compose rotate-by-angle, transpose/inverse/det/matrix/projection/
projplane/powers/diag fixes; divthm/gradfield/conservative/surface/fields/curtain/spacecurve/gradient/chain/order/
jacobian zoom/level+partials occlusion; methods' pictures wait for their board line (stLines/stFirstL) in ~18 methods,
plane3/square/markov/flux/dome fixes; Exam red mark = the set's estimate; duplicate 3-D tag; ‖ caption.
Still open:
- m-gauss: x label can touch R₃ at some angles (vzGaussScene label placement).
- Method step changes still use the WAAPI fade (methflicker can't see it); Back inside a step removes pieces instantly.
- projplane "closest" can sit tight against "w₂" when turned; order "y = 2" name half-faded at 96% (triangle).
- orient: small spike at the loop restart; m-markov k5 / m-green k4 methflicker flags are counters ticking (fine).
- REVIEW_FOLLOWUPS.md items other than exam timing are still open (check-answer, common mistakes, from=review, etc.).
