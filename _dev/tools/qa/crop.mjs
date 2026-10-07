import { writeFileSync, mkdirSync } from "node:fs";
// crop part of a saved PNG: IN, OUT, BOX="x,y,w,h" (in image pixels), via a page
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  const [x, y, w, h] = process.env.BOX.split(",").map(Number);
  writeFileSync(process.env.OUT + ".html", `<body style="margin:0"><div style="width:${w}px;height:${h}px;overflow:hidden;position:relative"><img src="file://${process.env.IN}" style="position:absolute;left:${-x}px;top:${-y}px"></div></body>`);
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: "file://" + process.env.OUT + ".html" }); await sleep(700);
  const s = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(process.env.OUT, Buffer.from(s.result.data, "base64"));
};
