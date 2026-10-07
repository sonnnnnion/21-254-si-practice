// Smoothness: for every picture, play its first playable slider in real time (CPU slowed CPU× , default 4) and record
// the true frame intervals (rAF) and the JS time of each vzDraw. Also drags the yaw/turn slider when there is one.
// Prints per picture: draw ms (mean / p95), frames over 25 ms (%), the longest frame, and the SVG size.
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: +(process.env.DPR || 1), mobile: false });
  await send("Page.navigate", { url: (process.env.BASE || "http://127.0.0.1:8254") + "/?v=" + Date.now() + "#/visualize" }); await sleep(2500);
  const CPU = +(process.env.CPU || 4);
  await send("Emulation.setCPUThrottlingRate", { rate: CPU });
  const ids = process.env.IDS ? process.env.IDS.split(",") : await evaluate(`VZ_LIST.filter(v => v.kind !== "steps").map(v => v.id)`);
  const SECS = +(process.env.SECS || 3);
  for (const id of ids) {
    await evaluate(`location.hash = '#/visualize/${id}'`); await sleep(1800);
    const r = await evaluate(`(async () => {
      if (!window.__wrapped) { const f = vzDraw; window.__dt = []; vzDraw = function (n) { const a = performance.now(); f(n); window.__dt.push(performance.now() - a); }; window.__wrapped = true; }
      const def = VzView.def, out = {};
      const run = async (label, start, stop) => {
        window.__dt = []; const iv = []; let last = performance.now(), go = true;
        start();
        const t0 = performance.now();
        await new Promise(res => { const f = now => { iv.push(now - last); last = now; if (now - t0 < ${SECS * 1000}) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
        stop();
        const d = window.__dt.slice().sort((a, b) => a - b), q = p => d.length ? d[Math.min(d.length - 1, Math.floor(d.length * p))] : 0;
        const slow = iv.filter(x => x > 25).length;
        out[label] = { draw: +(d.reduce((a, b) => a + b, 0) / (d.length || 1)).toFixed(1), p95: +q(.95).toFixed(1), slowPct: Math.round(100 * slow / iv.length), worst: Math.round(Math.max(...iv)), frames: iv.length };
      };
      const c = def.controls.find(c => !c.noPlay && c.type !== "matrix" && c.type !== "toggle");
      if (c) await run("play:" + c.k, () => vzSetPlay(c.k), () => vzSetPlay(null));
      const y = def.controls.find(c => c.k === "yaw");
      if (y) { let k = 0; const st = VzView.st, y0 = st.yaw; let iv; await run("turn", () => { iv = setInterval(() => { st.yaw = y0 + 40 * Math.sin(k++ / 12); VzView.stale = true; vzSyncControls(); }, 16); }, () => { clearInterval(iv); st.yaw = y0; }); }
      out.svg = document.getElementById("vzStage").innerHTML.length;
      return JSON.stringify(out);
    })()`);
    console.log(id.padEnd(14), r);
  }
  await send("Emulation.setCPUThrottlingRate", { rate: 1 });
};
