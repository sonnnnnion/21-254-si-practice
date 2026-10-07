// Whole-site smoke test: every route at desktop and phone width. Reports page errors and horizontal
// overflow, and saves a screenshot of each route's top (OUT=dir).  node tools/cdp.mjs tools/site_qa.mjs
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
const B = process.env.BASE || (process.env.BASE || "http://127.0.0.1:8254") + "/", OUT = process.env.OUT || tmpdir();   // screenshots stay out of the project
const ROUTES = ["/home", "/topics", "/section/1", "/section/4", "/section/7", "/section/10", "/problem/vecmat-001", "/problem/eig-006", "/problem/surfstokes-006",
  "/exam", "/review", "/visualize", "/visualize/subspace", "/visualize/span", "/visualize/independence", "/visualize/det", "/visualize/nullcol", "/visualize/vectors", "/visualize/m-eigen", "/visualize/m-flux", "/visualize/m-nullcol", "/visualize/gradfield", "/visualize/level", "/visualize/partials", "/visualize/arclength", "/visualize/order", "/visualize/jacobian", "/visualize/conservative", "/visualize/green", "/visualize/surface", "/visualize/flux", "/visualize/stokes", "/visualize/eigen", "/visualize/gradient", "/visualize/polar", "/walkthroughs", "/walkthroughs/si-05", "/walkthroughs/si-22"];
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message)+' @'+location.hash));addEventListener('unhandledrejection',e=>__errs.push('rej '+e.reason+' @'+location.hash));const _ce=console.error;console.error=(...a)=>{__errs.push(a.map(String).join(' ')+' @'+location.hash);_ce(...a)};" });
  for (const [w, h, tag] of [[1280, 900, "d"], [375, 812, "m"]]) {
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 });
    await send("Page.navigate", { url: B + "?v=qa" + Date.now() + "#/home" });
    for (let i = 0; i < 60 && !(await evaluate("!!(window.State && State.problemsById && State.problemsById.size)")); i++) await sleep(250);
    await sleep(800);
    for (const r of ROUTES) {
      await evaluate(`location.hash = '#${r}'`); await sleep(r.startsWith("/walkthroughs") ? 2200 : 1300);
      await evaluate("window.scrollTo(0, 0)"); await sleep(250);
      const o = await evaluate("({ over: document.documentElement.scrollWidth - innerWidth, view: (document.querySelector('.view.active') || {}).id, h: document.documentElement.scrollHeight })");
      if (o.over > 1) console.log(tag, r, "OVERFLOW", o.over);
      const s = await send("Page.captureScreenshot", { format: "png" });
      writeFileSync(`${OUT}/qa_${tag}_${r.replace(/\//g, "_")}.png`, Buffer.from(s.result.data, "base64"));
    }
    // exam run and keyboard help on this width
    await evaluate("localStorage.removeItem('pl254:examRun'); location.hash = '#/exam'"); await sleep(1200);
    await evaluate("document.getElementById('examGenerate').click()"); await sleep(2000);
    console.log(tag, "exam run:", await evaluate("location.hash"), await evaluate("document.documentElement.scrollWidth - innerWidth"));
    await evaluate("document.dispatchEvent(new KeyboardEvent('keydown', {key: '?', bubbles: true}))"); await sleep(400);
    console.log(tag, "help open:", await evaluate("!!document.getElementById('shortcutsHelp') && !document.getElementById('shortcutsHelp').hidden"));
    await evaluate("document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}))"); await sleep(300);
    console.log(tag, "help closed:", await evaluate("document.getElementById('shortcutsHelp').hidden"));
    await evaluate("localStorage.removeItem('pl254:examRun')");
    console.log(tag, "errors:", JSON.stringify(await evaluate("window.__errs")));
  }
};
