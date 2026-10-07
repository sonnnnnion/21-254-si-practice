import { writeFileSync, mkdirSync } from "node:fs";
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message)+' @'+location.hash));" });
  const W = +(process.env.W || 1440), H = +(process.env.H || 900); mkdirSync(process.env.OUT, { recursive: true });
  await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 });
  await send("Page.navigate", { url: (process.env.BASE || "http://127.0.0.1:8254") + "/?v=" + Date.now() + "#/home" }); await sleep(3000);
  if (process.env.UNLOCK) await evaluate("typeof setWalkUnlocked === 'function' && setWalkUnlocked(true)");
  for (const [h, name] of JSON.parse(process.env.ROUTES)) {
    await evaluate(`location.hash = '${h}'`); await sleep(+(process.env.WAIT || 2600));
    const ht = Math.min(+(process.env.MAXH || 3000), await evaluate("document.documentElement.scrollHeight"));
    const s = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: W, height: ht, scale: +(process.env.SC || .5) } });
    writeFileSync(`${process.env.OUT}/${name}.png`, Buffer.from(s.result.data, "base64")); console.log(name, ht);
  }
  console.log("errors", await evaluate("JSON.stringify(__errs)"));
};
