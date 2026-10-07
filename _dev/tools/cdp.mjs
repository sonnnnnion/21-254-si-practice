// Minimal Chrome DevTools Protocol driver (Node 22+, no packages). Used for tests the Browser pane
// can't do (service workers, offline). Usage: node tools/cdp.mjs <script.mjs>  (script exports default async ({send, evaluate, sleep}))
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// Chrome: CHROME=… if set, else the Mac app, else a Linux chrome/chromium on the PATH (for cloud sessions)
const CHROME = process.env.CHROME || ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser"].find(p => existsSync(p)) || "google-chrome";
// a fresh profile folder per run, and port 0: Chrome picks a free port and writes it to DevToolsActivePort, so
// many runs at once (several agents) can never attach to each other's browser
const dir = mkdtempSync(join(tmpdir(), "cdp-profile-"));
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--no-sandbox", "--remote-debugging-port=0", `--user-data-dir=${dir}`, "--window-size=1280,900", "about:blank"], { stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let port = 0, targets;
for (let i = 0; i < 100 && !port; i++) { try { port = +readFileSync(join(dir, "DevToolsActivePort"), "utf8").split("\n")[0]; } catch { await sleep(100); } }
if (!port) throw new Error("Chrome did not start (no DevToolsActivePort in " + dir + ")");
for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const page = targets.find(t => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r));
let id = 0; const pending = new Map();
ws.addEventListener("message", ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async expr => { const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description ?? r; };
try {
  const mod = await import(process.argv[2].startsWith("/") ? process.argv[2] : process.cwd() + "/" + process.argv[2]);
  await mod.default({ send, evaluate, sleep });
} finally {
  ws.close(); chrome.kill();
  // the throwaway profile is ~100-200 MB; remove it once Chrome has exited
  await new Promise(r => { chrome.once("exit", r); setTimeout(r, 3000); });
  const { rmSync } = await import("node:fs");
  try { rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch {}
}
