import { writeFileSync, mkdirSync } from "node:fs";
// Visualize states: STATES='[["id",{...state},"name", "optional js"],...]'; screenshots the main area
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message)+' @'+location.hash));" });
  const W = +(process.env.W || 1440), H = +(process.env.H || 900); mkdirSync(process.env.OUT, { recursive: true });
  await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 });
  await send("Page.navigate", { url: (process.env.BASE || "http://127.0.0.1:8254") + "/?v=" + Date.now() + "#/visualize" }); await sleep(2500);
  for (const [id, st, name, js] of JSON.parse(process.env.STATES)) {
    await evaluate(`location.hash = '#/visualize/${id}'`); await sleep(1500);
    await evaluate(`(() => { if (typeof ST !== "undefined" && ST.def) { Object.assign(ST, ${JSON.stringify(st)}); stShow(); return; } Object.assign(VzView.st, ${JSON.stringify(st)}); VzView.tweens = null; vzChanged(); })()`);
    if (js) await evaluate(js);
    await sleep(+(process.env.WAIT || 1400));
    const s = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: W, height: H, scale: +(process.env.SC || .5) } });
    writeFileSync(`${process.env.OUT}/${name}.png`, Buffer.from(s.result.data, "base64"));
  }
  console.log("errors", await evaluate("JSON.stringify(__errs)"));
};
