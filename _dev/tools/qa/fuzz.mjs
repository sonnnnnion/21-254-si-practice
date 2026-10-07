// Fuzz every Visualize picture: random slider values, every preset, panel choices, random drags; run
// static/draw/frame/readout and flag NaN, undefined, Infinity, doubled signs, "1v", raw underscores, thrown errors.
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message)+' @'+location.hash));" });
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: (process.env.BASE || "http://127.0.0.1:8254") + "/?v=" + Date.now() + "#/visualize" }); await sleep(2500);
  const r = await evaluate(`(() => {
    const out = {}, BAD = [/(^|[\\s=(+−])−?1(v|b|u|w|x)[₁₂₃]?\\b/, /NaN/, /undefined/, /Infinity/, /−\\s*−/, /\\+\\s*−\\s*\\d/, /−\\s*\\+/, /\\bnull\\b(?! space)/, /\\[object/];
    const strip = h => h.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ");
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    VZ_LIST.filter(d => d.kind !== 'steps').forEach(def => {
      const bad = new Set(), err = new Set(); let runs = 0;
      const variants = [{}];
      (def.presets || []).forEach(p => variants.push(p[1]));
      if (def.id === "subspace") for (const dim of [2, 3]) VZ_SETS[dim].forEach((W, set) => [0, 1, 2].forEach(test => variants.push({ dim, set, test, ux: W.u[0], uy: W.u[1], uz: W.u[2] || 0, vx: W.v[0], vy: W.v[1], vz: W.v[2] || 0 })));
      if (def.variants) def.variants.forEach(v => variants.push(v));
      ["fn", "fld", "map", "kind", "m", "cv", "reg", "tab", "dim", "mode"].forEach(k => { if (def.state && k in def.state && !def.controls.some(c => c.k === k)) for (let v = 0; v < 6; v++) variants.push({ [k]: v }); });
      variants.forEach(vr => {
        for (let it = 0; it < 30; it++) {
          const st = JSON.parse(JSON.stringify(def.state)); Object.assign(st, vr);
          const lists = { fn: def.fns || def.curves || (def.id === "gradfield" ? VZ_GF : VZ_FNS), fld: def.fields, map: def.maps, kind: def.kinds, m: def.mats, cv: def.curves, reg: def.regions, tab: def.tabs, mode: def.modes };
          let skip = false;
          Object.entries(lists).forEach(([k, L]) => { if (k in st && typeof st[k] === "number" && Array.isArray(L) && st[k] >= L.length) skip = true; });
          if (def.id === "subspace" && (!VZ_SETS[st.dim] || st.set >= VZ_SETS[st.dim].length)) skip = true;
          if (["tab", "dim", "mode"].includes(Object.keys(vr)[0]) && !def.controls && Object.values(vr)[0] > 3) skip = true;
          if (skip) continue;
          if (it) def.controls.forEach(c => { if (c.type === "toggle") st[c.k] = rnd() < .5; else if (c.type === "matrix") c.keys.forEach(k => { st[k] = +(c.min + rnd() * (c.max - c.min)).toFixed(2); }); else if (c.min != null) { const n = Math.round((c.max - c.min) / c.step); st[c.k] = +(c.min + Math.round(rnd() * n) * c.step).toFixed(6); } });
          if (it > 15 && def.handles) { try { def.handles(st).forEach(h => { def.dragTo && def.dragTo(st, h.k, h.x + (rnd() - .5) * 160, h.y + (rnd() - .5) * 160, it % 2 === 0); }); } catch (e) { err.add("drag: " + e.message); } }
          try {
            let html = "";
            if (def.static) html += def.static(st);
            html += def.draw(st, it * .37, false);
            if (def.frame) { const f = def.frame(null, st, it * .37); if (typeof f === "string") html += f; }
            const ro = def.readout(st); html += ro;
            runs++;
            const txt = strip(html);
            BAD.forEach(re => { const m = txt.match(re); if (m) { const i = m.index; bad.add(re + " … " + txt.slice(Math.max(0, i - 40), i + 40).replace(/\\s+/g, " ")); } });
            if (/[a-zA-Z]_[a-zA-Z{]/.test(strip(ro))) bad.add("underscore: " + strip(ro).match(/.{0,30}[a-zA-Z]_[a-zA-Z{].{0,30}/)[0]);
          } catch (e) { err.add(e.message + " " + JSON.stringify(vr)); }
        }
      });
      if (def.reset) def.reset();
      out[def.id] = { runs, bad: [...bad].slice(0, 6), err: [...err].slice(0, 4) };
    });
    return out;
  })()`);
  if (typeof r !== "object") { console.log("FUZZ FAILED:", String(r).slice(0, 600)); return; }
  let n = 0;
  for (const [id, v] of Object.entries(r)) { if (v.bad.length || v.err.length) { console.log(id, v.runs, JSON.stringify(v, null, 1)); n++; } else if (process.env.V) console.log(id, v.runs, "clean"); }
  console.log("pictures with issues:", n, "of", Object.keys(r).length, "page errors", await evaluate("JSON.stringify(__errs)"));
};
