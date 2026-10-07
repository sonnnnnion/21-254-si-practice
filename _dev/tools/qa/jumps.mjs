// Step every picture's Play frame by frame (10 s each) and flag discontinuities: a drawn coordinate moving > 20 px
// in one frame, or elements popping in/out (count changes).
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: (process.env.BASE || "http://127.0.0.1:8254") + "/?v=" + Date.now() + "#/visualize" }); await sleep(2500);
  const ids = process.env.IDS ? process.env.IDS.split(",") : await evaluate(`VZ_LIST.filter(v => v.kind !== "steps").map(v => v.id)`);
  const js = `(() => {
    const def = VzView.def, stage = document.getElementById("vzStage"), out = [], NUM = /-?\\d+(\\.\\d+)?/g;
    for (const c of def.controls.filter(c => !c.noPlay && c.type !== "matrix" && c.type !== "toggle")) {
      cancelAnimationFrame(VzView.raf); VzView.raf = 0;
      Object.assign(VzView.st, JSON.parse(JSON.stringify(def.state))); if (def.reset) def.reset();
      if (c.show && !c.show(VzView.st)) continue;
      VzView.tweens = null; vzSetPlay(c.k);
      let now = performance.now(), prev = null, maxJ = 0, pops = 0, where = "";
      for (let i = 0; i < 600; i++) {
        VzView.lastNow = now; now += 16.67; vzPlayStep(now); VzView.stale = true; vzDraw(now);
        const ph = VzView.phase && VzView.phase.name, h = stage._layers[1].innerHTML, nums = (h.match(NUM) || []).map(Number);
        if (prev && !["out", "in"].includes(ph) && !["out", "in"].includes(prev.ph)) {
          if (nums.length !== prev.n.length) pops++;
          else { let m = 0, mk = 0; for (let k = 0; k < nums.length; k++) { const d = Math.abs(nums[k] - prev.n[k]); if (d > m) { m = d; mk = k; } }
            if (m > maxJ) { maxJ = m; let mm, cnt = 0, pos = 0; const re = new RegExp(NUM.source, "g"); while ((mm = re.exec(h))) { if (cnt++ === mk) { pos = mm.index; break; } } where = h.slice(h.lastIndexOf("<", pos), pos + 24).slice(0, 120) + " @" + (Math.round(VzView.st[c.k] * 100) / 100); } }
        }
        prev = { n: nums, ph };
      }
      vzSetPlay(null);
      out.push(c.k + ": maxJump " + Math.round(maxJ) + " pops " + pops + (maxJ > 20 ? "\\n      WHERE " + where : ""));
    }
    vzStart(); return out.join(" | ");
  })()`;
  for (const id of ids) { await evaluate(`location.hash = '#/visualize/${id}'`); await sleep(1300); console.log(id.padEnd(14), await evaluate(js)); }
};
