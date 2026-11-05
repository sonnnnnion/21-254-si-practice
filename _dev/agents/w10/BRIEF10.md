# Wave 10 brief: polish pass on the new vector-calculus work

The rules, bar and QA tools from `~/dev-21254/w9/BRIEF9.md` (and BRIEF7) all still apply. Read those first if you
haven't.

## What the owner said (2026-11-04), about the dev build
> "these three could be improved [the index cards of m-fieldmatch, m-curldiv and m-isgrad]. also, in the match the
> fields, when you do show me one, you should show taking the gradient, doing a test point, checking the length if you
> notice the length should be 1, etc. just a bunch of strategies. it should be polished. cmon, everything new you've
> added you need to do a thorough polish and QA check to make sure its high quality"

## Workspace (new round, fresh copies of the current dev build)
- Base: `~/dev-21254/w10/base10/`. Never edit it.
- Copies: h1 → `~/dev-21254/w10/h1` on port 8391, h2 → `h2` on 8392, h3 → `h3` on 8393, h4 → `h4` on 8396.
  The w9 copies are retired, so don't edit them.
- Patch: `cd ~/dev-21254/w10 && diff -ru base10 hN > hN.patch`. Regenerate it after every verified piece.
- Stay inside your own blocks: the merged build already holds the other agents' work.
- **Index cards:** a method's card thumbnail is `def.draw()`. By default it calls `stThumb(def)`, which draws the
  LAST step's picture at its last beat; this is often cramped at card size. You may give your method its own
  `draw() { return ...svg... }`.
  - A card is an icon: clean and bold, readable at about 380 px wide, and showing the method's core move.
  - No tiny formula lists and no specks.
  - Check it on the Visualize index (`#/visualize`), at 1440 and at 390, with a screenshot that you LOOK at.
- Card text (`tagline`) is plain text, so never use `_` or `^`: write "∂P/∂y", or say it in words.
- Run checks in the foreground and one at a time. Batch your work into large turns.

## Final report (under 250 words)
What changed, the checks with their counts, the contact-sheet paths you looked at, and known limits.
