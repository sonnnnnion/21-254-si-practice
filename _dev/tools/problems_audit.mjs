// Visit every problem page and check its math and its sketch: MathJax errors, red (undefined-macro)
// text, raw TeX or underscores left in visible text, a missing sketch, and page errors.
//   node tools/cdp.mjs tools/problems_audit.mjs     (SHOT=id,id  OUT=dir  to also screenshot some panels)
import { writeFileSync } from "node:fs";
const B = process.env.BASE || (process.env.BASE || "http://127.0.0.1:8254") + "/", OUT = process.env.OUT || ".";
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message)));addEventListener('unhandledrejection',e=>__errs.push('rej '+e.reason));" });
  await send("Emulation.setDeviceMetricsOverride", { width: +(process.env.W || 1280), height: 1200, deviceScaleFactor: 1, mobile: +(process.env.W || 1280) < 700 });
  await send("Page.navigate", { url: B + "?v=pa" + Date.now() + "#/home" });
  for (let i = 0; i < 60 && !(await evaluate("!!(window.State && State.problemsById && State.problemsById.size)")); i++) await sleep(250);
  const ids = await evaluate("[...State.problemsById.keys()]");
  const shots = (process.env.SHOT || "").split(",").filter(Boolean);
  let bad = 0;
  for (const id of ids) {
    await evaluate(`location.hash = '#/problem/${id}'`); await sleep(500);
    await evaluate("window.MathJax && MathJax.startup && MathJax.startup.promise"); await sleep(350);
    const r = await evaluate(`(() => {
      const root = document.getElementById('studyMain');
      const merr = root.querySelectorAll('mjx-merror, [data-mjx-error]').length;
      let red = 0; root.querySelectorAll('mjx-container [fill="red"], mjx-container [style*="color: red"]').forEach(() => red++);
      const raw = []; const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement.closest('mjx-container, script, style, svg, textarea') ? 2 : 1 });
      while (tw.nextNode()) { const t = tw.currentNode.nodeValue; if (/\\\\[a-zA-Z]|[_^]\\{|[a-zA-Z]_[a-zA-Z0-9]/.test(t)) raw.push(t.trim().slice(0, 70)); }
      const panel = root.querySelector('.concept-panel');
      return { merr, red, raw: raw.slice(0, 3), panel: panel ? (panel.querySelector('canvas') ? '3d' : panel.querySelector('svg.sk') ? 'sketch' : 'old') : 'none' };
    })()`);
    const issue = r.merr || r.red || r.raw.length || r.panel !== 'sketch' && r.panel !== '3d';
    if (issue) { bad++; console.log(id, JSON.stringify(r)); }
    if (shots.includes(id)) {
      const b = await evaluate(`(() => { const p = document.querySelector('#studyMain .concept-panel'); p.scrollIntoView({block:'start'}); const r = p.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; })()`);
      await sleep(400);
      const s = await send("Page.captureScreenshot", { format: "png", clip: { x: b[0], y: Math.max(0, b[1]), width: b[2], height: Math.min(b[3], 1100), scale: 1 } });
      writeFileSync(`${OUT}/panel_${id}.png`, Buffer.from(s.result.data, "base64"));
    }
  }
  console.log("problems:", ids.length, "with issues:", bad, "| page errors:", JSON.stringify(await evaluate("window.__errs")));
};
