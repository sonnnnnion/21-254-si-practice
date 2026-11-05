# Wave 9 brief: field matching that actually teaches

Read `~/dev-21254/w7/BRIEF7.md` first. Its bar, standing rules and QA tools all apply. Then read "What good means
here" in `~/dev-21254/site/_dev/agents/BRIEF.md`. The site is one ~2.5 MB `index.html`: never read it whole. Grep for
an anchor, then read with offset and limit.

## What the owner said (2026-11-04)
> "[Match the fields] is a bit hard to use. i think you should literally drag and drop onto the fields, there shouldn't
> be a try, then match, then classify. i think it should feel more like a matching thing. it should also help walk
> through easier in case someone gets stuck, with an animation for how to do it kinda like a method. in fact, there
> should be a whole how to match method for this type of thing. finish strong cmon."

The two pictures they called useless (`probe`, `zoo`) have already been deleted. Do not bring back anything like them.

## The teaching idea (both agents share it)
You don't sketch the whole field. You **test**:
- plug in a few easy points, like (1, 0), (0, 1), (−1, 0) or (0, 0);
- note where F is zero;
- see whether the arrows change along rows or columns (that is, whether F depends on x only or on y only);
- see whether the arrows grow or stay the same length.

Each test **crosses out** the plots that disagree, and the last plot standing is the match. For "match f to the plot
of ∇f", compute ∇f first, then test it.

Use the same words in both pieces: "test point", "cross out", "the one left".

## Workspace
- `h1` → `~/dev-21254/w9/h1/` on http://127.0.0.1:8391/, and `h2` → `~/dev-21254/w9/h2/` on http://127.0.0.1:8392/.
- Diff base is `~/dev-21254/w9/base9/`. Never edit it.
- Patch: `cd ~/dev-21254/w9 && diff -ru base9 hN > hN.patch`. Regenerate it after every verified piece.
- Scratch: `/private/tmp/claude-501/agents/hN/`. No git and no pushes.
- QA tools are in `~/dev-21254/site/_dev/tools/qa`, run as `BASE=… node ../cdp.mjs X.mjs`.
  - Use `student.mjs` for methods (it steps every chip and every step and writes `issues.jsonl` + PNGs), plus
    steps, methflicker, film, shots, chaos, sheet and monkey.
  - Run **one checker at a time**. The machine is shared and overloads easily. If a run hangs for more than 10 min,
    kill it and only your own headless Chrome.
  - macOS has no `timeout` command.
- Verify every number with sympy (`~/anaconda3/bin/python3`). Use our own examples only; text never mentions exams.
- Check at 1440 and at 390 (phone), LOOK at the PNGs, and critique them as the owner would.

## h1: rebuild `fieldmatch` as a real matching game
- **Your code:**
  - the block that starts at `/* ---------- fieldmatch: six sets` and runs up to the next `/* ----------` marker;
  - its CSS (grep `fieldmatch` and `fm6` in the stylesheet);
  - the `SECTION_TOOLS` entry. Change its note to something like "Drag each formula onto its plot."
- Keep the six sets of examples and the clean 2×2 plots (they look good). Use a new localStorage key with validation:
  stale or garbage state must never break the page.
- **Interaction:** drag a formula card onto a plot. Use pointer events, so mouse and touch both work. Tap a card, then
  tap a plot, as a fallback that also works with the keyboard.
  - **Right:** the card snaps onto the plot, with a green check and a green frame.
  - **Wrong:** the card glides back, and a one-line nudge appears that comes from a real test. For example: "Not this
    one: at (1, 0) your formula gives [0, 1], straight up. These arrows point right." Compute that nudge from the
    formula and a test point that separates the two plots.
  - Remove the Try / Match / Classify stages and the irrotational/incompressible questions completely.
- **"Show me one"** (the method-like walkthrough, for when a student is stuck): it animates the reasoning for the next
  unmatched card, smoothly, in a few beats, with one short caption line each:
  1. Pick a test point and show the formula's value there (for gradient sets, first show ∇f).
  2. Draw that arrow in red at the test point on every remaining plot.
  3. Cross out or fade the plots that disagree. Use a second test point if one isn't enough.
  4. Fly the card to the one left.

  Pressing it again does the next card. A drag by the user cancels the animation cleanly. Add a small link:
  "How to match, step by step →" to `#/visualize/m-fieldmatch`.
- **When all four are matched:** a short success line and "Next set →". Keep progress per set while the page is
  open, and also across reloads.
- **Phone:** the plots stay 2×2 full width, and the cards sit in a wrapping row near them. Nothing may be hidden, and
  dragging must not scroll the page.
- Short text everywhere: one-line subtitle, one-line tip, no walls of text. Any colour that carries meaning gets a
  legend.

## h2: a new method `m-fieldmatch`, "Match a field to its plot"
- It is already registered in the methods list and `VZ_SECTION_OF`. Your code replaces the line
  `/* @@AGENT-H2 PLACEHOLDER ... @@ */`, which sits just before `const VZ_TAGLINE = {`. CSS goes below
  `/* @@CSS-H2 ... @@ */`. Helper names start with `H2_` or `h2`.
- Before writing, read the polish-bar methods fully: grep `id: "m-potential"`, `id: "m-critical"`, `id: "m-stokes"`
  and `id: "m-merge"`. Copy their structure, including the `mount(givenEl, rerender)` chips.
- **Situations** (chips), each a complete worked example with four plots and four formulas. Use your own examples,
  different from fieldmatch's FM6_SETS:
  1. **"Linear fields":** four fields of the form [ax + by, cx + dy], for example a spread, a spin, a saddle and a
     shear. Test points (1, 0) and (0, 1) settle almost everything.
  2. **"Depends on one variable":** for example a constant field, a field that changes only with x, one that changes
     only with y, and one zero along a line. The tests here are whether F is the same along rows or columns, where it
     is zero, and whether its length changes.
  3. **"Gradient of f":** four functions f, and four plots of ∇f. Step 1 computes ∇f, then the tests follow.
- **Steps** (adapt them to each situation):
  1. What differs between the plots.
  2. Where is F = 0?
  3. A test point.
  4. Another test point or a row/column check.
  5. The one left.
  Each step's `t` is a few words; its `why` is one or two short sentences; its `sum` is a line.
- **Picture:** the four small plots, labelled A–D, with the formula list. On each beat:
  - draw the test-point arrow in red on every plot still in play;
  - cross out or fade the plots that disagree;
  - when a formula is settled, draw a line or tag from it to its plot.
  Add a legend ("test arrow", "crossed out", "matched"). The motion must be smooth and video-like: no pops.
- Notation: F = [P, Q] in brackets, ∇f.

## Final report (under 300 words)
- What you built, and its teaching sentence.
- What you verified (tools and their flag counts, sympy, your visual check at 1440 and 390).
- The contact-sheet paths.
- Known limits.

## h3: a new method `m-choosepar`, "Choose how to parametrize"
The owner's words: "there should be a method on literally choosing how to parameterize a surface with the different
cases too, like cylinder and plane intersection, a literal circle, or like a line between points yknow? you should
teach better based on whats on the lectures."

### What already exists, and what is new
`m-param` already works through each curve recipe: segment, circle arc, cylinder ∩ plane, graph and level curve.
`m-paramsurf` does the same for surfaces: plane, graph, cylinder, sphere and cone. Read both fully.

What is missing is the **choosing**. Before any recipe, a student has to read the problem, spot the clue and pick the
strategy. The lectures list the strategies; quote their substance, not their wording or examples.
- **L18, the three strategies for curves:**
  1. Everything is in terms of one variable: set that variable equal to t.
  2. A circle or a similar shape: use cos and sin.
  3. A line: r(t) = p + t v.
- **L31, the three strategies for surfaces:**
  1. z is a function of x and y: set x = u and y = v.
  2. A circular shape: use a version of polar coordinates.
  3. A plane: r(u, v) = p + u a + v b.

Read `~/dev-21254/ref/lintxt/Lecture 18 Complete.txt` and `Lecture 31 Complete.txt`. Never copy their examples or
numbers.

### Teaching sentence
"Find the clue in the problem, and it tells you which of the three recipes to use."

### Steps (adapt them per situation)
1. **Curve or surface?** Count the free directions: a curve gets one parameter t, a surface gets two, u and v.
2. **Find the clue.** Highlight it in the problem statement itself:
   - "x² + y² = 4" → round;
   - "from P to Q" → straight;
   - "y = …" or "z = …" → a graph;
   - "where the cylinder meets the plane" → round for x and y, then solve the plane for z.
3. **Pick the recipe.** The picture shows the three strategy cards, with the chosen one lit and the others faded.
4. **Fill it in.**
5. **The range** of t, or of u and v.
6. **A quick check:** plug one point back in.

### Situations (chips, grouped in two labelled rows if that reads well)
- **Curves:**
  - a segment between two points;
  - a circle (not centred at the origin is fine);
  - cylinder ∩ plane (this combines strategies 2 and 1);
  - a graph y = g(x) or a curve given as a level set.
- **Surfaces:**
  - a graph z = g(x, y) over a region;
  - a round surface: a cylinder, a paraboloid or a cone in polar form;
  - a plane through a point containing two vectors, or through three points.

Use our own examples, different from the numbers in m-param and m-paramsurf, and verify everything with sympy.

### Picture
- The three strategy cards ("curves" or "surfaces", depending on the situation), with the chosen card lit.
- The shape drawn in 2-D or 3-D, built up as the recipe is filled in: the clue's shape appears first, then the
  parametrization traces it.
- The clue phrase highlighted in the problem box, if you can do that cleanly. Otherwise echo the clue in the picture.
- A legend for any colour that carries meaning.

Reuse the site's vz 3-D helpers (see how m-paramsurf and m-param draw). Match the polish of m-potential, m-critical
and m-stokes.

### Workspace
- Your copy: `~/dev-21254/w9/h3/` on http://127.0.0.1:8393/.
- The id is already registered in your copy. Your code replaces `/* @@AGENT-H3 PLACEHOLDER ... @@ */`, just before
  the `m-param (a)` helper block. CSS goes below `/* @@CSS-H3 ... @@ */`; never edit the spacer line.
- Helper names start with `H3_` or `h3`.
- Patch: `cd ~/dev-21254/w9 && diff -ru base9 h3 > h3.patch`. The patch includes the registry lines, which is
  expected.
