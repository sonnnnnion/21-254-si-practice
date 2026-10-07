export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: +(process.env.W || 1440), height: +(process.env.H || 900), deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: (process.env.BASE || "http://127.0.0.1:8254") + "/?v=" + Date.now() + (process.env.HASH || "#/home") }); await sleep(+(process.env.WAIT || 3500));
  console.log(await evaluate(process.env.JS));
};
