# Wave 10 handoff (2026-11-04)
- **fieldmatch (h1):** Show me one picks strategies for each card: the gradient written out, zeros, a constant or changing
  length, a row or column strip, and test points. The status line is honest, the cards' typography is fixed, and the
  card has a new icon. Set 6 now uses [cos y, sin y] (length 1).
- **m-fieldmatch (h2):** a new card icon and a "Length 1" chip. Bold card icons for m-chain, m-extrema, m-greencheck,
  m-tangent, m-lineint and m-work; their h2Card* helpers live in the m-fieldmatch block.
- **m-choosepar (h3):** a card icon, plus label fixes.
- **m-curldiv and m-isgrad (h4):** reworked around a paddle wheel. New cards, and taglines that use ∂ (no P_y).
- **Lead edits, made directly in w10/merged (not in any patch):**
  - m-work: the moving r′(t) label fades near the axis letters (`S.avoid`).
  - m-tangent: the moving r′(t) label fades near the given-point label (`g1Gap`).
- **QA on the merged build:**
  - student.mjs on the 10 touched ids: 0 flags at 1440 and 390, after the lead fixes.
  - steps.mjs on all methods: clean.
  - methflicker: smooth.
  - fm.mjs: 23/23 on desktop and phone.
  - monkey: 100 pages, 0 errors.
  - The card audit sheet was looked at.
- main is still 36ea9ad.
