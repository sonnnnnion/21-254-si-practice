# 21-254 Practice Lab

An unofficial supplemental instruction (SI) practice resource for CMU **21-254:
Linear Algebra and Vector Calculus for Engineers**.

**Live site:** https://sonnnnnion.github.io/21-254-si-practice/#/home

The problems are original practice problems designed for review.
They are not official course materials.

## What's here

```
index.html            the entire app — static, single file, vanilla HTML/CSS/JS
data/                 10 section files of guided practice problems (JSON)
walkthroughs/         SI-leader teaching guides (JSON) + index
vendor/mathjax/       local MathJax bundle (renders math with no internet)
manifest.webmanifest  web-app manifest (name, icon, theme)
icon-192.png / 512    app icons
```

## Features

- 95 guided problems across 10 sections, mapped to the course exam structure
- Hints, setup, step-by-step worked solutions, final answers, common mistakes
- Interactive **3-D concept visuals** (drag to rotate) for cross products,
  span planes, surfaces, tangent planes, gradients, Stokes' theorem, flux,
  and triple-integral regions — plus 2-D concept sketches everywhere else
- Exam Mode review-set generator (Exams 1–4 + Final)
- "Got it" / "Need Review" progress tracking, scratch boxes, keyboard shortcuts
- Progress lives only in the browser (`localStorage`) — no login, no backend
- Every problem has a Report Issue button that opens a pre-filled email

## Hosting

Designed for GitHub Pages: push the contents of this folder to the repo root
and enable Pages. Everything (including MathJax) is served from the repo, so
there are no external runtime dependencies.

## Desktop app (macOS)

A double-clickable **21-254 Practice Lab.app** (on the Desktop, outside this
folder) launches the site in its own standalone window via a tiny local server,
so it works fully offline. On each launch it syncs this folder into a stable copy
under `~/Library/Application Support/` and serves from there — this avoids a
macOS/iCloud quirk where a server run straight from the synced Desktop folder can
go stale and start returning 404s. Keep the `21-254` folder on the Desktop (the
app reads from it); if you move it, update `SOURCE` in the app's launcher script.
