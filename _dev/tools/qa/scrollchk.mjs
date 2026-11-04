// real student flow: click a chip, then press Next through every beat; after each press check the newest line is visible in the board
export default async ({ send, evaluate, sleep }) => {
  const W = +(process.env.W || 1440), H = +(process.env.H || 900);
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 });
  await send("Page.navigate", { url: process.env.BASE + "/?v=" + Date.now() + "#/visualize" }); await sleep(2500);
  for (const spec of process.env.CASES.split(";")) {
    const [id, c] = spec.split(":");
    await evaluate(`location.hash = '#/visualize/${id}'`); await sleep(1500);
    await evaluate(`document.querySelectorAll('#stGiven .vz-chip')[${c || 0}]?.click()`); await sleep(1200);
    const res = [];
    for (let i = 0; i < 40; i++) {
      const more = await evaluate(`(() => { const b = [...document.querySelectorAll('#vizRoot button')].find(b => /^Next/.test(b.textContent.trim())); if (!b || b.disabled) return false; b.click(); return true; })()`);
      if (!more) break;
      await sleep(+(process.env.WAIT || 1800));
      res.push(await evaluate(`(() => {
        const lines = [...document.querySelectorAll('#stNow .st-step.now .st-line.on')]; const el = lines[lines.length - 1] || document.querySelector('#stNow .st-step.now');
        if (!el) return 'none';
        let sc = el.parentElement; while (sc && !(sc.scrollHeight > sc.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement;
        const r = el.getBoundingClientRect(), v = sc ? sc.getBoundingClientRect() : { top: 0, bottom: innerHeight };
        const top = Math.max(v.top, 0), bot = Math.min(v.bottom, innerHeight);
        return (r.bottom > top + 4 && r.top < bot - 4 ? 'ok' : 'HIDDEN') + ' k=' + ST.k + ' b=' + ST.b + (sc ? ' sc=' + (sc.id || sc.className).slice(0, 20) : ' page');
      })()`));
    }
    console.log(spec, res.filter(x => !x.startsWith('ok')).join(' | ') || 'all visible', '(' + res.length + ' presses)');
  }
};
