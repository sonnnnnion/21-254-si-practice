# QA tools (headless Chrome via ../cdp.mjs; site served at http://127.0.0.1:8254 from
# ~/Library/Application Support/21-254 Practice Lab/site — run ./sync.sh after editing github-upload)

./sync.sh                                   copy github-upload/ to the local server folder
node ../cdp.mjs probe.mjs  HASH='#/x' JS='expr'          evaluate JS on a page, print the result
node ../cdp.mjs shots.mjs  OUT=dir STATES='[["id",{state},"name"],...]' [SC=.5 W= H= PRE=js]   Visualize states
node ../cdp.mjs pages.mjs  OUT=dir ROUTES='[["#/home","name"],...]' [W= H= SC= MAXH=]          whole pages
node ../cdp.mjs sheet.mjs  DIR=dir OUT=dir [N=6 W=420 C=3]                                     contact sheets
node ../cdp.mjs fuzz.mjs                    every picture: random states/presets/drags → NaN/undefined/raw text/errors
node ../cdp.mjs chaos.mjs  [IDS= N=40 SEED=]  careless user: real mouse drags/clicks/sliders/play; handles off stage etc.
node ../cdp.mjs neardeg.mjs [IDS=]          drag every handle onto / next to / in line with every other; labels at rest
node ../cdp.mjs jumps.mjs  [IDS=]           step Play frame by frame; flag jumps/pop-ins
node ../cdp.mjs monkey.mjs                  open all pages, random clicks, page errors
node ../cdp.mjs steps.mjs                   every method: math renders, play to end, keyboard, phone
./waitpages.sh <sha>                        wait for GitHub Pages build of <sha>, compare live index.html with the deploy clone
node ../cdp.mjs perf.mjs   [IDS= CPU=4 DPR=1 SECS=3]   real frame times while playing / turning (draw ms, frames over 25 ms)
node ../cdp.mjs flicker.mjs [IDS= N=240 MIN=.006 RATIO=3 SAVE=dir]   rasterise every Play/turn frame; flag pops (frames that change far more than their neighbours)
node ../cdp.mjs methflicker.mjs [IDS= SAVE=dir]   the same for the method pictures, step by step
