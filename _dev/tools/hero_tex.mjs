// Pre-render the rotating heroes' formulas with the site's own MathJax (SVG, no font cache) so the
// hero pictures get real math typesetting with no runtime dependency on MathJax.
// Run with the local preview up on :8254:  node tools/cdp.mjs tools/hero_tex.mjs
// Prints a `const HERO_TEX = {...}` line to paste over the one in index.html's hero script.
const B = process.env.BASE || (process.env.BASE || "http://127.0.0.1:8254") + "/";
const R = "#C8102E";
const F = {
  circ:    String.raw`\oint_C {\color{${R}}{\mathbf F}}\cdot d\mathbf r`,
  linear:  String.raw`T(\mathbf x)={\color{${R}}{A}}\,\mathbf x`,
  eigen:   String.raw`A\mathbf v={\color{${R}}{\lambda}}\,\mathbf v`,
  ascent:  String.raw`\nabla {\color{${R}}{f}}`,
  flux:    String.raw`\oint_C {\color{${R}}{\mathbf F}}\cdot\mathbf n\,ds`,
  stokes:  String.raw`\oint_C {\color{${R}}{\mathbf F}}\cdot d\mathbf r=\iint_S (\nabla\times{\color{${R}}{\mathbf F}})\cdot d\mathbf S`,
  polar:   String.raw`dA={\color{${R}}{r}}\,dr\,d\theta`,
  project: String.raw`{\color{${R}}{\mathbf p}}=\operatorname{proj}_W \mathbf b`,
  cross:   String.raw`\|\mathbf u\times\mathbf v\|=\text{area}`,
  riemann: String.raw`\iint_R {\color{${R}}{f(x,y)}}\,dA`,
};
export default async ({ send, evaluate, sleep }) => {
  await send("Page.enable");
  await send("Page.navigate", { url: B + "manifest.webmanifest" }); await sleep(800);   // any same-origin page
  await evaluate(`(() => {
    window.MathJax = { svg: { fontCache: 'none' }, startup: { typeset: false } };   // \color autoloads from vendor/
    const s = document.createElement('script'); s.src = 'vendor/mathjax/tex-svg.js'; document.documentElement.appendChild(s);
  })()`);
  for (let i = 0; i < 40 && !(await evaluate("!!(window.MathJax && MathJax.tex2svgPromise)")); i++) await sleep(250);
  await evaluate("MathJax.startup.promise");
  const out = {};
  for (const [k, tex] of Object.entries(F)) {
    const svg = await evaluate(`MathJax.tex2svgPromise(${JSON.stringify(tex)}, { display: false }).then(n => n.querySelector('svg').outerHTML)`);
    if (typeof svg !== "string" || /merror|data-mjx-error/.test(svg)) throw new Error("render failed: " + k + " " + String(svg).slice(0, 200));
    if (!/viewBox=/.test(String(svg))) throw new Error("no svg for " + k + ": " + JSON.stringify(svg).slice(0, 300));
    const vb = svg.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
    const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")
      .replace(/ data-(mml-node|c|latex|mjx-[a-z-]+|semantic-[a-z-]+)="[^"]*"/g, "")
      .replace(/<title>.*?<\/title>/g, "").replace(/ stroke-width="0"/g, "")
      .replace(/(\d+\.\d{2})\d+/g, "$1");   // two decimals is plenty at hero scale
    out[k] = { vb, g: inner };
  }
  console.log("const HERO_TEX = " + JSON.stringify(out) + ";");
};
