// A filmstrip of what a student sees: open a picture, press its first Play button for real, and screenshot the
// picture (and its panel) every EVERY ms, FRAMES times. OUT=dir IDS=a,b [EVERY=250 FRAMES=24 SC=.5 PRE=js]
import { writeFileSync, mkdirSync } from "node:fs";
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable"); mkdirSync(process.env.OUT, { recursive: true });
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: (process.env.BASE || "http://127.0.0.1:8254") + "/?v=" + Date.now() + "#/visualize" }); await sleep(2500);
  const EVERY = +(process.env.EVERY || 250), FR = +(process.env.FRAMES || 24), SC = +(process.env.SC || .5);
  for (const id of process.env.IDS.split(",")) {
    await evaluate(`location.hash = '#/visualize/${id}'`); await sleep(1600);
    if (process.env.PRE) await evaluate(process.env.PRE);
    await evaluate(`(() => { const b = document.querySelector(".vz-play"); if (b) b.click(); })()`);
    for (let i = 0; i < FR; i++) {
      const s = await send("Page.captureScreenshot", { format: "png", clip: { x: 20, y: 110, width: 1400, height: 760, scale: SC } });
      writeFileSync(`${process.env.OUT}/${id}_${String(i).padStart(3, "0")}.png`, Buffer.from(s.result.data, "base64"));
      await sleep(EVERY);
    }
  }
  console.log("errors", await evaluate("JSON.stringify(window.__errs || [])"));
};
