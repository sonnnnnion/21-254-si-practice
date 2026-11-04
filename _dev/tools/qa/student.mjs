import { writeFileSync, mkdirSync, appendFileSync } from "node:fs";
// every method × chip × step at final beat; W/H; OUT; IDS. writes PNGs + issues.jsonl
export default async ({ send, evaluate, sleep }) => {
  const W = +(process.env.W || 1440), H = +(process.env.H || 900), ph = W < 700, OUT = process.env.OUT; mkdirSync(OUT, { recursive: true });
  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message)));addEventListener('unhandledrejection',e=>__errs.push('rej '+e.reason));" });
  await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: ph });
  await send("Page.navigate", { url: process.env.BASE + "/?v=" + Date.now() + "#/visualize" }); await sleep(3000);
  const CHECK = `(() => {
    const out = {}, root = document.getElementById('vizRoot');
    out.merr = root.querySelectorAll('mjx-merror').length;
    const txt = (root.querySelector('#stNow')?.innerText || '') + (root.querySelector('#stGiven')?.innerText || '');
    out.raw = /\\\\\\(|\\\\\\[|\\\\frac|\\\\mathbf/.test(txt);
    const plain = [...root.querySelectorAll('.st-outline li, .vz-chip, .st-step h3, .st-step .st-t, #stPic text')].map(e => e.textContent).filter(t => /[_^]/.test(t));
    out.plain = plain.slice(0, 4);
    const pic = root.querySelector('#stPic svg') || root.querySelector('#stPic');
    out.nan = /NaN|Infinity/.test(pic?.innerHTML || '');
    out.overflow = document.documentElement.scrollWidth > innerWidth + 1;
    const sr = pic.getBoundingClientRect(); const eff = el => { let o = 1; for (let e = el; e && e !== pic; e = e.parentElement) { const cs = getComputedStyle(e); o *= +cs.opacity; if (e.getAttribute && e.getAttribute('opacity')) o *= +e.getAttribute('opacity'); if (cs.display === 'none' || cs.visibility === 'hidden') o = 0; } return o; };
    const T = [...pic.querySelectorAll('text')].filter(t => t.textContent.trim() && eff(t) > .35 && !t.closest('#stPicOld')).map(t => ({ s: t.textContent.trim().slice(0, 24), r: t.getBoundingClientRect() })).filter(o => o.r.width > 0);
    out.clip = T.filter(o => o.r.left < sr.left - 2 || o.r.right > sr.right + 2 || o.r.top < sr.top - 2 || o.r.bottom > sr.bottom + 2).map(o => o.s).slice(0, 4);
    const ov = []; for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) { const a = T[i].r, b = T[j].r; const w = Math.min(a.right, b.right) - Math.max(a.left, b.left), h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (w > 0 && h > 0 && w * h > .3 * Math.min(a.width * a.height, b.width * b.height)) ov.push(T[i].s + ' ⟷ ' + T[j].s); }
    out.overlap = ov.slice(0, 5);
    out.tiny = ${ph} ? T.filter(o => o.r.height < 9.5).map(o => o.s).slice(0, 4) : [];
    out.errs = window.__errs.splice(0);
    return JSON.stringify(out);
  })()`;
  for (const id of process.env.IDS.split(",")) {
    await evaluate(`location.hash = '#/visualize/${id}'`); await sleep(1800);
    const nC = Math.max(1, await evaluate(`document.querySelectorAll('#stGiven .vz-chip').length`));
    for (let c = 0; c < nC; c++) {
      if (nC > 1) { await evaluate(`document.querySelectorAll('#stGiven .vz-chip')[${c}].click()`); await sleep(1400); }
      const nK = await evaluate(`ST.def.steps.length`);
      for (let k = -1; k < nK; k++) {
        await evaluate(`(() => { ST.playing = false; ST.k = ${k}; ST.b = ${k} < 0 ? 0 : ST.def.steps[${k}].tex.length - 1; stShow(); })()`);
        await sleep(+(process.env.WAIT || 3800));
        const r = JSON.parse(await evaluate(CHECK));
        const bad = r.merr || r.raw || r.plain.length || r.nan || r.overflow || r.clip.length || r.overlap.length || r.tiny.length || r.errs.length;
        if (bad) appendFileSync(`${OUT}/issues.jsonl`, JSON.stringify({ id, c, k, ...r }) + "\n");
        const sel = ph ? "#stPic" : ".st-main";
        await evaluate(`document.querySelector('${sel}').scrollIntoView({block:'start'}); ${ph} && scrollBy(0, -76)`); await sleep(150);
        const b = JSON.parse(await evaluate(`JSON.stringify(document.querySelector('${sel}').getBoundingClientRect())`));
        const s = await send("Page.captureScreenshot", { format: "png", clip: { x: b.x, y: b.y + (await evaluate("scrollY")), width: b.width, height: Math.min(b.height, ph ? 600 : 1100), scale: ph ? 1 : .5 }, captureBeyondViewport: true });
        writeFileSync(`${OUT}/${id}_c${c}_k${String(k + 1).padStart(2, "0")}.png`, Buffer.from(s.result.data, "base64"));
      }
    }
    console.log("done", id);
  }
};
