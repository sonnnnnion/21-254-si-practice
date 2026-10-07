import { writeFileSync, mkdirSync } from "node:fs";
// For every picture with 2+ handles: drag each handle onto / 3 px / 10 px / nearly in line with each other (real mouse),
// then flag huge coordinates, labels off the picture, readout numbers > 999, NaN, and labels still moving at rest.
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message)));" });
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: (process.env.BASE || "http://127.0.0.1:8254") + "/?v=" + Date.now() + "#/visualize" }); await sleep(2500);
  const ids = process.env.IDS ? process.env.IDS.split(",") : await evaluate(`VZ_LIST.filter(v => v.kind !== "steps" && v.handles && v.handles(v.state).length >= 2).map(v => v.id)`);
  const OUT = process.env.OUT; if (OUT) mkdirSync(OUT, { recursive: true });
  const mouse = (type, x, y) => send("Input.dispatchMouseEvent", { type, x, y, button: "left", buttons: type === "mouseReleased" ? 0 : 1, clickCount: type === "mouseMoved" ? 0 : 1 });
  let total = 0;
  for (const id of ids) {
    await evaluate(`location.hash = '#/visualize/${id}'`); await sleep(1400);
    const names = await evaluate(`VzView.def.handles(VzView.st).map(h => h.k)`);
    const found = [];
    for (const a of names) for (const b of names) {
      if (a === b) continue;
      for (const mode of ["onto", "3px", "10px", "inline-near", "inline-far"]) {
        await evaluate(`(() => { Object.assign(VzView.st, JSON.parse(JSON.stringify(VzView.def.state))); if (VzView.def.reset) VzView.def.reset(); VzView.tweens = null; vzSetPlay(null); vzChanged(); })()`); await sleep(120);
        const g = await evaluate(`(() => { const r = document.getElementById("vzStage").getBoundingClientRect(), s = r.width / 600, hs = VzView.def.handles(VzView.st), A = hs.find(h => h.k === "${a}"), B = hs.find(h => h.k === "${b}"); const P = VzView.def.P && VzView.def.P.X ? [VzView.def.P.X(0), VzView.def.P.Y(0)] : [300, 225]; return A && B ? { L: r.left, T: r.top, s, A: [A.x, A.y], B: [B.x, B.y], O: P } : null; })()`);
        if (!g) continue;
        let t = g.B.slice();
        if (mode === "3px") t = [t[0] + 3, t[1] + 2]; else if (mode === "10px") t = [t[0] + 8, t[1] - 6];
        else if (mode.startsWith("inline")) { const d = [g.B[0] - g.O[0], g.B[1] - g.O[1]], k = mode === "inline-near" ? .55 : 1.45; t = [g.O[0] + d[0] * k + d[1] * .02, g.O[1] + d[1] * k - d[0] * .02]; }
        const sx = g.L + g.A[0] * g.s, sy = g.T + g.A[1] * g.s, tx = g.L + t[0] * g.s, ty = g.T + t[1] * g.s;
        await mouse("mouseMoved", sx, sy); await mouse("mousePressed", sx, sy);
        for (let i = 1; i <= 8; i++) await mouse("mouseMoved", sx + (tx - sx) * i / 8, sy + (ty - sy) * i / 8);
        await sleep(80);
        const check = `(() => { const out = [], st = document.getElementById("vzStage"), gr = st.querySelector(":scope > g[clip-path]");
          gr.querySelectorAll("text").forEach(t => { const b = t.getBBox(); if (t.textContent.trim() && (b.x + b.width < 0 || b.x > 600 || b.y + b.height < 0 || b.y > 450)) out.push("label off picture: " + t.textContent.trim().slice(0, 24)); });
          const ro = (() => { const r = document.getElementById("vzReadout"); if (!r) return ""; const c = r.cloneNode(true); c.querySelectorAll(".vz-fr").forEach(f => f.replaceWith(" " + f.children[0].textContent + " / " + f.children[1].textContent + " ")); return c.textContent; })();
          const rn = (ro.replace(/\\d*√\\d+/g, " ").match(/−?\\d+(\\.\\d+)?/g) || []).map(v => Math.abs(parseFloat(v.replace("−", "-")))); if (rn.some(v => v > 999)) out.push("readout number blows up: " + ro.replace(/\\s+/g, " ").slice(0, 90));
          if (/NaN|Infinity|undefined/.test(gr.innerHTML + ro)) out.push("NaN/Infinity");
          return out; })()`;
        const mid = await evaluate(check);
        await mouse("mouseReleased", tx, ty); await sleep(420);
        const end = await evaluate(check);
        const jit = await evaluate(`(async () => { const g = document.querySelector("#vzStage > g[clip-path]"), snap = () => [...g.querySelectorAll("text")].map(t => t.textContent + "@" + t.getAttribute("x") + "," + t.getAttribute("y")).join("|");
          await new Promise(r => setTimeout(r, 500)); const a = snap(); let moved = 0; for (let i = 0; i < 12; i++) { await new Promise(r => requestAnimationFrame(r)); if (snap() !== a) moved++; } return moved; })()`);
        if (jit && !(await evaluate("!!VzView.def.frame || !!VzView.def.animate"))) end.push("labels still moving at rest (" + jit + " of 12 frames)");
        const all = [...new Set([...mid.map(m => "while dragging: " + m), ...end.map(m => "after: " + m)])];
        if (all.length) {
          found.push(`${a}→${b} ${mode}: ${all.join("; ")}`);
          if (OUT) { const r = await send("Page.captureScreenshot", { format: "png", clip: { x: g.L, y: g.T, width: 600 * g.s, height: 450 * g.s, scale: .45 } }); writeFileSync(`${OUT}/${id}_${a}_${b}_${mode}.png`, Buffer.from(r.result.data, "base64")); }
        }
      }
    }
    const errs = await evaluate(`(() => { const e = __errs.slice(); __errs.length = 0; return e; })()`);
    total += found.length + errs.length;
    console.log(id.padEnd(13), found.length || errs.length ? "" : "clean");
    found.slice(0, 12).forEach(f => console.log("   " + f.slice(0, 230)));
    errs.forEach(e => console.log("   ERROR " + e));
  }
  console.log("TOTAL ISSUES", total);
};
