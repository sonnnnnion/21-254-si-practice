// Open every Visualize page (and a few others), click every visible button/chip once, press Play, check errors
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message)+' @'+location.hash));addEventListener('unhandledrejection',e=>__errs.push('rej '+String(e.reason)+' @'+location.hash));" });
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: (process.env.BASE || "http://127.0.0.1:8254") + "/?v=" + Date.now() + "#/visualize" }); await sleep(2500);
  const ids = await evaluate(`VZ_LIST.map(v => v.id)`);
  for (const id of ids) {
    await evaluate(`location.hash = '#/visualize/${id}'`); await sleep(900);
    await evaluate(`(async () => { const bs = [...document.querySelectorAll("#vizRoot .vz-panel button, #vizRoot .st-panel button, #vizRoot .vz-toggle")].filter(b => b.offsetParent && !/report/i.test(b.className)); for (const b of bs) { b.click(); await new Promise(r => setTimeout(r, 90)); } })()`);
    await sleep(500);
  }
  for (const h of ["#/home", "#/topics", "#/exam", "#/review", "#/walkthroughs", "#/problem/eig-003"]) { await evaluate(`location.hash = '${h}'`); await sleep(900); }
  console.log("pages", ids.length, "errors", await evaluate("JSON.stringify(__errs)"));
};
