// Visual smoothness: step every picture's Play (and a turn of the view, if it has one) frame by frame, rasterise the
// picture after each frame, and measure how much it changed since the frame before. Smooth motion changes a little
// every frame; a pop, snap or jump shows as one frame that changes far more than the ones around it.
// Prints per picture/control: spikes (frames changing > 4× the local median and > 1.5% of pixels), the worst ratio
// and where it happened. SAVE=dir also saves the before/after frames of the worst spike as PNG.
import { writeFileSync, mkdirSync } from "node:fs";
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: (process.env.BASE || "http://127.0.0.1:8254") + "/?v=" + Date.now() + "#/visualize" }); await sleep(2500);
  const ids = process.env.IDS ? process.env.IDS.split(",") : await evaluate(`VZ_LIST.filter(v => v.kind !== "steps").map(v => v.id)`);
  const N = +(process.env.N || 240), SAVE = process.env.SAVE; if (SAVE) mkdirSync(SAVE, { recursive: true });
  for (const id of ids) {
    await evaluate(`location.hash = '#/visualize/${id}'`); await sleep(1400);
    const r = await evaluate(`(async () => {
      const def = VzView.def, stage = document.getElementById("vzStage"), W = 300, H = 225;
      const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const cx = cv.getContext("2d", { willReadFrequently: true });
      const snap = async () => {
        const s = new XMLSerializer().serializeToString(stage).replace(/<svg /, '<svg width="600" height="450" ');
        const img = new Image(); img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
        await img.decode().catch(() => {});
        cx.fillStyle = "#fff"; cx.fillRect(0, 0, W, H); try { cx.drawImage(img, 0, 0, W, H); } catch (e) {}
        return { px: cx.getImageData(0, 0, W, H).data, url: cv.toDataURL("image/png") };
      };
      const diff = (a, b) => { let n = 0; for (let i = 0; i < a.length; i += 4) { if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 60) n++; } return n / (a.length / 4); };
      const runs = [];
      const ctls = def.controls.filter(c => !c.noPlay && c.type !== "matrix" && c.type !== "toggle").map(c => ({ k: c.k, play: true }));
      if (def.controls.some(c => c.k === "yaw")) ctls.push({ k: "yaw", play: false });
      for (const c of ctls) {
        cancelAnimationFrame(VzView.raf); VzView.raf = 0;
        Object.assign(VzView.st, JSON.parse(JSON.stringify(def.state))); if (def.reset) def.reset(); VzView.tweens = null;
        const y0 = VzView.st.yaw;
        if (c.play) vzSetPlay(c.k);
        let now = performance.now(), prev = null, ds = [], at = [], worst = null;
        for (let i = 0; i < ${N}; i++) {
          VzView.lastNow = now; now += 16.67;
          if (c.play) vzPlayStep(now); else VzView.st.yaw = y0 + 70 * Math.sin(i / ${N} * Math.PI * 2);
          VzView.stale = true; vzDraw(now);
          const s = await snap();
          if (prev) { const d = diff(prev.px, s.px); ds.push(d); at.push({ i, v: Math.round(VzView.st[c.k] * 100) / 100, a: prev.url, b: s.url }); }
          prev = s;
        }
        vzSetPlay(null);
        // spikes: a frame that changes far more than the median of the 9 frames around it
        let spikes = 0, wr = 0, wi = -1;
        for (let i = 0; i < ds.length; i++) {
          const w = ds.slice(Math.max(0, i - 4), i + 5).filter((_, j) => j !== Math.min(4, i)).sort((a, b) => a - b), m = w[Math.floor(w.length / 2)] || 0;
          const ratio = ds[i] / Math.max(m, .002);
          if (ds[i] > (+"${process.env.MIN || .006}") && ratio > (+"${process.env.RATIO || 3}")) { spikes++; if (ratio > wr) { wr = ratio; wi = i; } }
        }
        runs.push({ k: c.k, spikes, worst: Math.round(wr * 10) / 10, at: wi >= 0 ? at[wi].v : null, frac: wi >= 0 ? Math.round(ds[wi] * 1000) / 10 : 0, a: wi >= 0 ? at[wi].a : null, b: wi >= 0 ? at[wi].b : null });
      }
      vzStart();
      return JSON.stringify(runs);
    })()`);
    let runs; try { runs = JSON.parse(r); } catch (e) { console.log(id.padEnd(14), "ERR", String(r).slice(0, 200)); continue; }
    console.log(id.padEnd(14), runs.map(x => `${x.k}: ${x.spikes} spikes${x.spikes ? ` (worst ×${x.worst}, ${x.frac}% of pixels, at ${x.at})` : ""}`).join(" | "));
    if (SAVE) runs.forEach(x => { if (x.a) { writeFileSync(`${SAVE}/${id}_${x.k}_a.png`, Buffer.from(x.a.split(",")[1], "base64")); writeFileSync(`${SAVE}/${id}_${x.k}_b.png`, Buffer.from(x.b.split(",")[1], "base64")); } });
  }
};
