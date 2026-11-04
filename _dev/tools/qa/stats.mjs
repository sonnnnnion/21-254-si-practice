export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: process.env.BASE + "/?v=" + Date.now() + "#/visualize" }); await sleep(3000);
  const ids = await evaluate(`VZ_LIST.filter(v => v.kind === "steps").map(v => v.id)`);
  const strip = "s => s.replace(/\\\\\\(.*?\\\\\\)/g, 'M').replace(/<[^>]+>/g, '')";
  for (const id of ids) {
    await evaluate(`location.hash = '#/visualize/${id}'`); await sleep(900);
    const r = await evaluate(`(() => { const S = ${strip}, d = ST.def; const why = d.steps.map(s => S(s.why || '').length), t = d.steps.map(s => (s.t || '').length);
      const chips = [...document.querySelectorAll('#stGiven .vz-chip')]; const rows = new Set(chips.map(c => Math.round(c.getBoundingClientRect().top))).size;
      return JSON.stringify({ n: d.steps.length, why: Math.max(...why), whyAvg: Math.round(why.reduce((a, b) => a + b, 0) / why.length), title: Math.max(...t), prob: S(d.problem || '').length, chips: chips.length, rows, tag: (d.tagline || '').length }); })()`);
    console.log(id.padEnd(14), r);
  }
};
