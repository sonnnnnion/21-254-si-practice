# Wave 7 brief: make the vector-calculus wave actually TEACH (read all of it before you start)

**21-254 Practice Lab** is a free study site for CMU's Linear Algebra and Vector Calculus course. It's unofficial and
made for students who find the course hard. The owner is an SI leader who uses it to teach their students. The whole
site is one large file, `index.html` (about 2.1 MB, about 25,000 lines). **Never read it whole**: grep for your block
and read it with offset and limit.

Wave 6 added vector-calculus content. The owner opened it and rejected it as "slop". Their words:
- "the ball is not rolling in a good way, its like behind the map and you cant see it"
- "these animations are also poor. i looked at the extreme value theorem, and it's animation helps literally nobody"
- "I expect everything in this site to be able to genuinely fulfill it's core purpose on teaching students ...
  vector calculus is inherently visual and i need your help on teaching my students"
- "you need to ACTUALLY really test out the stuff you create, so its not just slop"

The wave was pulled from the live site. Your job is to make your part **genuinely teach** and look like the site's
best work: the home-page hero animations, `riemann`, `fields`, `m-potential`.

## The bar (read this twice)
1. **Teaching first.** Before you change anything, write down in 1–2 sentences, for each picture or method, *what a
   confused student should understand after 20 seconds with it*. Every on-screen element and every animation beat
   must serve that sentence. Motion that just moves something around ("a dot climbs a ridge") is not teaching.
   Animate the *reasoning*: what the student would do on paper, made visible.
2. **Everything visible.** No element may be hidden behind another (3-D occlusion: draw it at the right depth or
   on top with a halo), lost in low contrast (pink on pink), off the stage, or too small to read. Colour that
   carries meaning always gets a legend.
3. **Really test it like a student.** Not just the tools: press Play and look at a filmstrip of *every* beat. Drag
   every handle. Try every preset, including mid-animation. Turn the 3-D view to awkward angles. Check 1440 px and
   390 px (phone). Then look at the PNGs yourself and critique them honestly, as the owner would: "would this help
   a confused student? is anything hidden, cramped, ugly, or meaningless?" Fix it and look again. Repeat until you
   would proudly show it.
4. The owner's standing rules (in full in `~/dev-21254/site/_dev/agents/BRIEF.md`; read its first section
   "What good means here" and the "Sixth wave" section):
   - short text, no intimidation: a one-line `tagline`, a `tryIt` under ~70 characters, a short readout, a one-sentence
     status, and the `blurb` folded away behind "The idea";
   - smooth, video-like motion: no pops, short pauses, clean loop resets;
   - nothing overlapping;
   - correct math, checked with sympy (`~/anaconda3/bin/python3`);
   - our own examples only, never past exams or the owner's SI worksheets (the list of functions to avoid is in
     BRIEF.md);
   - no text that mentions exams;
   - no computed numbers drawn on area or integral pictures (numbers go in the readout);
   - no Lagrange multipliers (not in this course).

## Workspace
- Your copy: `~/dev-21254/w7/fN/`, served at `http://127.0.0.1:837N/` (f1 → 8371 …). Edit ONLY `fN/index.html`
  (plus `fN/data/*.json` if your prompt says so).
- The diff base is `~/dev-21254/w7/base7/` (= the wave-6 build, dev commit e960f98). Never edit it.
- Patch: `cd ~/dev-21254/w7 && diff -ru base7 fN > fN.patch`. **Regenerate it after every verified piece**, so the
  patch on disk is always a working state. (You have a turn limit, and you may be resumed.)
- Scratch: `/private/tmp/claude-501/agents/fN/`. No git, no pushes, nothing outside your copy and scratch.
- **Edit boundaries:**
  - Change only the `vzAdd`/`stAdd` blocks of your own ids, plus helpers used only by them. Any new helper names
    start with your prefix.
  - CSS goes just below your line `/* @@CSS-FN ... @@ */` near the end of the first stylesheet. Never edit the spacer
    lines.
  - Do not change shared helpers or the runtime. If you really need a shared change, describe it in your report
    instead.
  - The four agents' patches are merged together, so stay inside your blocks.

## QA tools
Headless Chrome tools live in `~/dev-21254/site/_dev/tools/qa`. Treat them as read-only and run them from that folder,
one at a time (4 agents share this machine):
```bash
cd ~/dev-21254/site/_dev/tools/qa; B=http://127.0.0.1:837N; O=/private/tmp/claude-501/agents/fN
BASE=$B OUT=$O/f IDS=crit3d EVERY=300 FRAMES=20 SC=.5 node ../cdp.mjs film.mjs   # filmstrip after pressing the first Play
DIR=$O/f OUT=$O/fs N=20 W=420 C=4 node ../cdp.mjs sheet.mjs                     # contact sheet: LOOK at it
BASE=$B OUT=$O/s STATES='[["crit3d",{"preset":1},"a"]]' node ../cdp.mjs shots.mjs  # states; 4th item = JS to run; W=390 H=844 SC=1 for phone
BASE=$B IDS=crit3d node ../cdp.mjs chaos.mjs        # careless-user drags/clicks
BASE=$B IDS=crit3d N=300 node ../cdp.mjs flicker.mjs # pops while playing/turning
BASE=$B IDS=m-critical node ../cdp.mjs steps.mjs ; BASE=$B IDS=m-critical node ../cdp.mjs methflicker.mjs   # methods
BASE=$B node ../cdp.mjs monkey.mjs                   # page errors (once, near the end)
```
Read the PNGs yourself: the tools catch errors, but only your eyes catch "this teaches nothing". Use contact sheets
rather than many single images. `film.mjs` presses the first `.vz-play`. For other states write a small script in your
scratch dir modelled on `film.mjs`/`shots.mjs`, e.g. to drag, pick a preset, then film.

## Final report (your last message, under ~350 words)
- For each id: the teaching sentence, what you changed, and what you saw in the filmstrips. Name the contact-sheet
  paths so the lead can look at them.
- What you verified and how.
- Known limits.
- Anything you'd still improve.
The lead reviews every filmstrip independently and will send work back if it doesn't teach.
