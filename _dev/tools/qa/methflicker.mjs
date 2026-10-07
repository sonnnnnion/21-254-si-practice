// Method pictures: for every method and step, rasterise pic(k, b, u) for u = 0 … DUR s at 30 frames a second (b = each
// line in turn, advancing the way Play does) and flag frames that change far more than the ones around them (pops).
import { writeFileSync, mkdirSync } from "node:fs";
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: (process.env.BASE || "http://127.0.0.1:8254") + "/?v=" + Date.now() + "#/visualize" }); await sleep(2500);
  const ids = process.env.IDS ? process.env.IDS.split(",") : await evaluate(`VZ_LIST.filter(v => v.kind === "steps" && v.pic).map(v => v.id)`);
  const SAVE = process.env.SAVE; if (SAVE) mkdirSync(SAVE, { recursive: true });
  for (const id of ids) {
    const r = await evaluate(`(async () => {
      const def = VZ_BY_ID["${id}"], W = 180, H = 230, cv = document.createElement("canvas"); cv.width = W; cv.height = H; const cx = cv.getContext("2d", { willReadFrequently: true });
      const snap = async html => { const s = '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="460" viewBox="0 0 360 460">' + vzDefs() + html + '</svg>'; const img = new Image(); img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s); await img.decode().catch(() => {}); cx.fillStyle = "#fff"; cx.fillRect(0, 0, W, H); try { cx.drawImage(img, 0, 0, W, H); } catch (e) {} return { px: cx.getImageData(0, 0, W, H).data, url: cv.toDataURL("image/png") }; };
      const diff = (a, b) => { let n = 0; for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 60) n++; return n / (a.length / 4); };
      const out = []; let worst = null;
      const now0 = performance.now(), realNow = performance.now.bind(performance);
      for (let k = 0; k < def.steps.length; k++) {
        const nb = def.steps[k].tex.length, ds = [], ats = []; let prev = null;
        const DUR = Math.max(4, (def.picDur || 3200) / 1000 + 1);
        for (let f = 0; f <= DUR * 30; f++) {
          const u = f / 30, b = Math.min(nb - 1, Math.floor(u / 1.6));
          performance.now = () => now0 + u * 1000;          // picLive pictures sway with the clock: keep it in step
          let html; try { html = def.pic(k, b, u); } catch (e) { out.push("ERR k" + k + ": " + e.message); break; }
          const sn = await snap(html);
          if (prev) { ds.push(diff(prev.px, sn.px)); ats.push({ u, a: prev.url, b: sn.url }); }
          prev = sn;
        }
        performance.now = realNow;
        for (let i = 0; i < ds.length; i++) {
          const w = ds.slice(Math.max(0, i - 4), i + 5).filter((_, j) => j !== Math.min(4, i)).sort((a, b) => a - b), m = w[Math.floor(w.length / 2)] || 0, ratio = ds[i] / Math.max(m, .002);
          if (ds[i] > .006 && ratio > 3) { out.push("k" + k + " @" + ats[i].u.toFixed(2) + "s ×" + ratio.toFixed(1) + " " + (ds[i] * 100).toFixed(1) + "%"); if (!worst || ratio > worst.r) worst = { r: ratio, a: ats[i].a, b: ats[i].b, k }; }
        }
      }
      performance.now = realNow;
      return JSON.stringify({ out, worst });
    })()`);
    let j; try { j = JSON.parse(r); } catch (e) { console.log(id.padEnd(13), "ERR", String(r).slice(0, 200)); continue; }
    console.log(id.padEnd(13), j.out.length ? j.out.join(" | ") : "smooth");
    if (SAVE && j.worst) { writeFileSync(`${SAVE}/${id}_a.png`, Buffer.from(j.worst.a.split(",")[1], "base64")); writeFileSync(`${SAVE}/${id}_b.png`, Buffer.from(j.worst.b.split(",")[1], "base64")); }
  }
};
