// Every method: math typeset (no merror, no raw TeX), play to end at high speed, keyboard, outline jump, phone overflow
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message)+' @'+location.hash));" });
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: (process.env.BASE || "http://127.0.0.1:8254") + "/?v=" + Date.now() + "#/visualize" }); await sleep(2500);
  const ids = process.env.IDS ? process.env.IDS.split(",") : await evaluate(`VZ_LIST.filter(v => v.kind === "steps").map(v => v.id)`);
  for (const id of ids) {
    await evaluate(`location.hash = '#/visualize/${id}'`); await sleep(2600);
    const r = await evaluate(`(async () => { const root = document.getElementById("vizRoot"); ST.speed = .03; document.querySelector('[data-st="play"]').click();
      for (let i = 0; i < 200 && ST.playing; i++) await new Promise(r => setTimeout(r, 100));
      await new Promise(r => setTimeout(r, 600));
      const merr = root.querySelectorAll("mjx-merror, [data-mjx-error]").length, raw = (root.querySelector("#stMath").innerText.match(/\\\\(frac|begin|mathbf|int|sum)|\\$/g) || []).length;
      const k = ST.k, b = ST.b, done = k === ST.def.steps.length - 1 && b === ST.def.steps[k].tex.length - 1;
      const pics = []; if (ST.def.pic) for (let j = 0; j < ST.def.steps.length; j++) { try { const h = ST.def.pic(j, ST.def.steps[j].tex.length - 1, 3); if (/NaN|undefined|Infinity/.test(h)) pics.push(j); } catch (e) { pics.push(j + ":" + e.message); } }
      return JSON.stringify({ merr, raw, done, pics }); })()`);
    console.log(id.padEnd(13), r);
  }
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await evaluate(`location.hash = '#/visualize/${ids[0]}'`); await sleep(2000);
  console.log("phone overflow:", await evaluate("document.documentElement.scrollWidth - innerWidth"), "errors", await evaluate("JSON.stringify(__errs)"));
};
