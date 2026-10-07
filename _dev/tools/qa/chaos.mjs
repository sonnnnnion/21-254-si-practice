// A careless user on every Visualize picture with real mouse/keyboard events; checked after every action:
// page errors, NaN/Infinity/undefined in picture or readout, handles off the stage, labels far off, sliders out of range.
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message)+' @'+location.hash));addEventListener('unhandledrejection',e=>__errs.push('rej '+String(e.reason)+' @'+location.hash));" });
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: (process.env.BASE || "http://127.0.0.1:8254") + "/?v=" + Date.now() + "#/visualize" }); await sleep(2500);
  const ids = process.env.IDS ? process.env.IDS.split(",") : await evaluate(`VZ_LIST.filter(v => v.kind !== "steps").map(v => v.id)`);
  let seed = +(process.env.SEED || 11); const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, pick = a => a[Math.floor(rnd() * a.length)];
  const N = +(process.env.N || 40);
  const mouse = (type, x, y) => send("Input.dispatchMouseEvent", { type, x, y, button: "left", buttons: type === "mouseReleased" ? 0 : 1, clickCount: type === "mouseMoved" ? 0 : 1 });
  const click = async (x, y) => { await mouse("mousePressed", x, y); await mouse("mouseReleased", x, y); };
  const key = async k => { await send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code: k, windowsVirtualKeyCode: { ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40 }[k] }); await send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code: k }); };
  let total = 0;
  for (const id of ids) {
    await evaluate(`location.hash = '#/visualize/${id}'`); await sleep(1400);
    const issues = new Map(), log = [];
    for (let i = 0; i < N; i++) {
      const info = await evaluate(`(() => { const st = document.getElementById("vzStage").getBoundingClientRect(), d = VzView.def, s = st.width / 600;
        const hs = d.handles ? d.handles(VzView.st).map(h => [h.k, st.left + h.x * s, st.top + h.y * s]) : [];
        const vis = sel => [...document.querySelectorAll(sel)].filter(e => e.offsetParent && !e.disabled).map(e => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
        const P = d.P && d.P.X ? [st.left + d.P.X(0) * s, st.top + d.P.Y(0) * s] : [st.left + 300 * s, st.top + 225 * s];
        return { st: [st.left, st.top, st.width, st.height], hs, P, plays: vis(".vz-play"), chips: vis(".vz-panel [data-preset], .vz-panel .vz-chip, .vz-panel .vz-seg button"), btns: vis(".vz-panel button:not(.vz-play):not(.vz-report):not([data-preset])"), toggles: vis(".vz-panel .vz-toggle"),
          ranges: [...document.querySelectorAll(".vz-panel input[type=range]")].filter(e => e.offsetParent).map(e => e.id), mx: [...document.querySelectorAll(".vz-mx-grid input")].map(e => e.id) }; })()`);
      const [L, T, W, H] = info.st, r = rnd();
      let act;
      if (r < .34 && info.hs.length) {
        const h = pick(info.hs), kind = rnd();
        const tgt = kind < .25 ? [L - 60 + rnd() * (W + 120), T - 60 + rnd() * (H + 120)] : kind < .45 ? info.P : kind < .6 && info.hs.length > 1 ? pick(info.hs).slice(1) : [L + rnd() * W, T + rnd() * H];
        act = `drag ${h[0]} → ${tgt.map(Math.round)}`;
        await mouse("mouseMoved", h[1], h[2]); await mouse("mousePressed", h[1], h[2]);
        for (let s = 1; s <= 6; s++) await mouse("mouseMoved", h[1] + (tgt[0] - h[1]) * s / 6, h[2] + (tgt[1] - h[2]) * s / 6);
        await mouse("mouseReleased", tgt[0], tgt[1]);
        if (rnd() < .3) { const k = pick(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]); await key(k); act += " +" + k; }
      } else if (r < .5 && info.ranges.length) {
        const rid = pick(info.ranges), f = rnd(); act = `slider ${rid} ${f.toFixed(2)}`;
        await evaluate(`(() => { const e = document.getElementById("${rid}"); e.value = +e.min + (+e.max - +e.min) * ${f}; e.dispatchEvent(new Event("input", { bubbles: true })); })()`);
      } else if (r < .64 && info.plays.length) { const p = pick(info.plays); act = "play/pause"; await click(p[0], p[1]); await sleep(rnd() * 1800); }
      else if (r < .76 && info.chips.length) { const p = pick(info.chips); act = "chip"; await click(p[0], p[1]); await sleep(rnd() * 500); }
      else if (r < .84 && info.btns.length) { const p = pick(info.btns); act = "button"; await click(p[0], p[1]); }
      else if (r < .89 && info.toggles.length) { const p = pick(info.toggles); act = "toggle"; await click(p[0], p[1]); }
      else if (r < .93 && info.mx.length) { const m = pick(info.mx), v = pick(["-3", "0", "2.5", "1", "", "-0.7", "9"]); act = `matrix ${m}=${v}`; await evaluate(`(() => { const e = document.getElementById("${m}"); e.value = "${v}"; e.dispatchEvent(new Event("input", { bubbles: true })); })()`); }
      else { act = "stage click"; await click(L + rnd() * W, T + rnd() * H); }
      log.push(act);
      await sleep(60 + rnd() * 250);
      const chk = await evaluate(`(() => { const out = [], st = document.getElementById("vzStage"), d = VzView.def;
        const g = st.querySelector(":scope > g[clip-path]"), html = g ? g.innerHTML : "", ro = (() => { const r = document.getElementById("vzReadout"); if (!r) return ""; const c = r.cloneNode(true); c.querySelectorAll(".vz-fr").forEach(f => f.replaceWith(" " + f.children[0].textContent + " / " + f.children[1].textContent + " ")); return c.textContent; })();
        if (/NaN|Infinity|undefined/.test(html)) out.push("bad number in picture: " + (html.match(/.{0,50}(NaN|Infinity|undefined).{0,20}/) || [""])[0]);
        if (/NaN|Infinity|undefined|\\bnull\\b(?! space)|\\[object/.test(ro)) out.push("bad readout: " + ro.slice(0, 80));
        Object.entries(VzView.st).forEach(([k, v]) => { if (typeof v === "number" && !isFinite(v)) out.push("state " + k + " = " + v); });
        if (d.handles) d.handles(VzView.st).forEach(h => { if (!(h.x > -5 && h.x < 605 && h.y > -5 && h.y < 455)) out.push("handle " + h.k + " off stage at " + Math.round(h.x) + "," + Math.round(h.y)); });
        g && g.querySelectorAll("text").forEach(t => { const b = t.getBBox(); if (t.textContent.trim() && (b.x + b.width < -2 || b.x > 602 || b.y + b.height < -2 || b.y > 452)) out.push("label off picture: " + t.textContent.trim().slice(0, 20)); });
        d.controls.forEach(c => { if (c.type === "matrix" || c.type === "toggle") return; const v = VzView.st[c.k]; if (typeof v === "number" && (v < c.min - 1e-6 || v > c.max + 1e-6)) out.push("slider " + c.k + " out of range: " + v); });
        return out; })()`);
      (Array.isArray(chk) ? chk : ["checker failed: " + String(chk).slice(0, 120)]).forEach(m => { if (!issues.has(m)) issues.set(m, log.slice(-4).join(" | ")); });
    }
    await evaluate(`vzSetPlay(null)`);
    const errs = await evaluate(`(() => { const e = __errs.slice(); __errs.length = 0; return e; })()`);
    errs.forEach(e => issues.set("ERROR " + e, log.slice(-3).join(" | ")));
    total += issues.size;
    console.log(id.padEnd(14), issues.size ? "" : "clean");
    for (const [m, l] of issues) console.log("    " + m.slice(0, 160) + "\n        after: " + l.slice(0, 200));
  }
  console.log("TOTAL ISSUES", total);
};
