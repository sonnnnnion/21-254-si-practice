# Wave 8 brief: new vector-calculus METHODS (read all of it before you start)

First read `~/dev-21254/w7/BRIEF7.md`: the bar, the rules and the QA tools all apply. Then read "What good means here"
in `~/dev-21254/site/_dev/agents/BRIEF.md`.

## What the owner asked for
The owner is an SI leader whose class is in vector calculus right now. Their words:

> "you need to really teach the new content for vector calculus in a really clear way, perhaps in methods. like how to
> find critical points based on some defined area, how to find r'(t) or the line integral based on certain situations
> (and different types of examples like cylinder and plane, a circle, a line) ... i realllyyy want this new side to be
> developed in methods"

A method is a step-by-step worked example. It shows how a student actually solves this kind of problem on paper,
with a picture that carries the reasoning of each step.

## Methods: how they work in index.html
- A method is an `stAdd({ id, title, card, given, steps: [{ t, tex: [...], why, sum }], pic(k, b, u) })` block.
  - `k` is the step and `b` is the beat within it; `u` runs 0→1 to animate the beat.
  - Helpers: `stLines`, `stNote`, `stM`, `stGrid`, `stEase`, plus the `vz*` drawing helpers.
- Before writing anything, read 2–3 methods fully. Grep `id: "m-potential"`, `id: "m-critical"`, `id: "m-flux"`.
  - `m-critical` and `m-flux` were just reworked so the picture carries the reasoning; they are the polish bar,
    together with `m-potential`.
- **Situations / cases:** a method can show several situations through chips in its "given" area.
  - Example chips: line segment | circle | cylinder ∩ plane.
  - Use the `def.mount(givenEl, rerender)` hook. See how `tool-crit` / `tool-field` use it (grep `mount(`).
  - Switching a chip swaps the example (its steps and picture) and calls rerender. Each situation is its own
    complete worked example with its own picture.
  - Persist the chosen situation in your own variable while the page is open.
- Text rules:
  - Step `t`: a few words. `why`: one or two short sentences.
  - Use the course's notation (Stewart-style, as in lectures 18–35): r(t), r′(t), |r′(t)|, ds = |r′(t)| dt,
    ∫_C f ds, ∫_C F·dr, ∇f, D, dA, r dr dθ, r_u × r_v, dS.
  - Vectors go in brackets: [a, b, c].
- Course content reference: the lecture notes are in
  `~/dev-21254/ref/lintxt/`
  (L18 curves … L35) and the SI keys in `~/dev-21254/ref/sitxt/`.
  - Use them to learn WHAT is taught and the standard situations.
  - Never copy their problems or numbers. Our own examples only. Text never mentions exams.
- Math: verify every number with sympy (`~/anaconda3/bin/python3`). Prefer examples that come out clean.

## Workspace
- Your copy: `~/dev-21254/w8/gN/`, served at `http://127.0.0.1:838N/` (g1 → 8381, …). Diff base: `~/dev-21254/w8/base8/`.
  Never edit base8.
- Your ids are ALREADY registered in `VZ_GROUP_OF` (method list) and `VZ_SECTION_OF`. Don't edit those.
- Code goes in place of your line `/* @@AGENT-GN PLACEHOLDER (...) @@ */`, which sits just before `const VZ_TAGLINE = {`.
  CSS goes below `/* @@CSS-GN ... @@ */`. Never edit the spacer lines.
- Helper names start with `GN_` / `gN`. Don't edit shared helpers, the runtime or other ids, except where your prompt
  says so.
- Patch: `cd ~/dev-21254/w8 && diff -ru base8 gN > gN.patch`. Regenerate it after each verified method.
- Scratch: `/private/tmp/claude-501/agents/gN/`.

## Checks
For each method and each situation, do all of the following, run from `~/dev-21254/site/_dev/tools/qa`:
- `steps.mjs` and `methflicker.mjs`, with `IDS=your ids` and `BASE=http://127.0.0.1:838N`.
- Screenshots of every step at its final beat, at 1440 and 390, put on a contact sheet that you LOOK at.
- Critique it honestly, as the owner would: does a confused student now know how to do this?
- Run `monkey.mjs` once at the end.

You have a 30-turn limit and may be resumed, so batch your edits and checks per turn.

## Final report (under 300 words)
- For each method: the teaching sentence and its situations.
- What you verified.
- The contact-sheet paths.
- Known limits.
