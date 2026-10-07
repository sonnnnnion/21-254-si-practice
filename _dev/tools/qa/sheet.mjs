import { writeFileSync, readdirSync, mkdirSync } from "node:fs";
// contact sheets of every png/jpg in DIR: N per sheet, W px each, C columns; OUT is a directory
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable"); mkdirSync(process.env.OUT, { recursive: true });
  const dir = process.env.DIR, files = readdirSync(dir).filter(f => /\.(png|jpe?g)$/.test(f)).sort(), N = +(process.env.N || 6), W = +(process.env.W || 420), C = +(process.env.C || 3);
  for (let k = 0; k * N < files.length; k++) {
    const part = files.slice(k * N, k * N + N);
    const html = `<body style="margin:0;background:#ddd;display:grid;grid-template-columns:repeat(${C},${W}px);gap:6px;padding:6px;align-items:start">` + part.map(f => `<div style="position:relative"><img src="file://${dir}/${f}" style="width:${W}px;display:block"><span style="position:absolute;left:4px;top:2px;font:700 12px monospace;background:#fff;color:#c00">${f}</span></div>`).join("") + "</body>";
    writeFileSync(`${process.env.OUT}/_sheet.html`, html);
    const PW = C * W + 6 * (C + 1);
    await send("Emulation.setDeviceMetricsOverride", { width: PW, height: 800, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: `file://${process.env.OUT}/_sheet.html?${Date.now()}` }); await sleep(1200);
    const h = await evaluate("document.body.scrollHeight");
    const s = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: PW, height: h, scale: 1 } });
    writeFileSync(`${process.env.OUT}/sheet_${k}.png`, Buffer.from(s.result.data, "base64"));
  }
  console.log("sheets", Math.ceil(files.length / N));
};
