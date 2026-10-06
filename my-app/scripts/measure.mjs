// Đo hiệu năng + chụp ảnh minh chứng cho báo cáo TH02.
// Chạy: node scripts/measure.mjs  (cần `npm run dev` ở cổng 5173)
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:5173";
const CHROME =
  process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = "docs/images";
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = {};

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: { width: 1200, height: 800 },
});

async function newPage(url) {
  const page = await browser.newPage();
  const logs = [];
  page.on("console", async (msg) => {
    try {
      const parts = [];
      for (const a of msg.args()) {
        const v = await a.jsonValue().catch(() => "[object]");
        if (typeof v === "string") {
          if (/^(color|font-weight|background)/.test(v.trim())) continue;
          parts.push(v.replace(/%c/g, "").trim());
        } else {
          const s = JSON.stringify(v);
          parts.push(s && s.length > 150 ? s.slice(0, 150) + "…" : s);
        }
      }
      logs.push({ type: msg.type(), text: parts.join(" ") });
    } catch {
      /* ignore */
    }
  });
  const requests = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto(url, { waitUntil: "networkidle0" });
  return { page, logs, requests };
}

async function consoleImage(name, title, lines) {
  const html = `<body style="margin:0;background:#1e1e1e;color:#d4d4d4;font:13px Consolas,monospace">
  <div style="background:#2d2d2d;padding:6px 12px;border-bottom:1px solid #444">DevTools — Console &nbsp;|&nbsp; ${title}</div>
  <div style="padding:8px 12px;white-space:pre-wrap">${lines
    .map((l) => {
      const color = l.type.startsWith("startGroup") ? "#7cc7ff" : "#d4d4d4";
      const t = l.text.replace(/</g, "&lt;");
      return `<div style="color:${color};border-bottom:1px solid #2a2a2a;padding:2px 0">${t}</div>`;
    })
    .join("")}</div></body>`;
  const p = await browser.newPage();
  await p.setViewport({ width: 1100, height: Math.min(900, 80 + lines.length * 24) });
  await p.setContent(html);
  await p.screenshot({ path: `${OUT}/${name}.png` });
  await p.close();
}

const shot = (page, name, opts = {}) => page.screenshot({ path: `${OUT}/${name}.png`, ...opts });
const counter = (page) => page.evaluate(() => window.__cardRenders ?? 0);
const resetCounter = (page) => page.evaluate(() => (window.__cardRenders = 0));
const loggerLines = (logs) =>
  logs.filter((l) => l.text && !/Download the React DevTools|\[vite\]/.test(l.text));

// ---------- 1. Redux-logger + chức năng (bản tối ưu) ----------
{
  const { page, logs, requests } = await newPage(`${BASE}/`);
  await page.waitForSelector("[data-testid^=card-]");
  await shot(page, "01-home");

  logs.length = 0;
  await page.click("#btn-open-form");
  await page.select("#subject", "Lập trình Web");
  await page.type("#title", "Bai tap demo TH02");
  await page.$eval("#deadline", (el) => {
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    set.call(el, "2030-12-31");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.select("#priority", "high");
  await shot(page, "02a-add-form");
  await page.click("#btn-submit-form");
  await sleep(500);
  await shot(page, "02b-after-add");
  await consoleImage("03-console-add", "Thêm bài tập (addAssignment)", loggerLines(logs));
  results.logAdd = loggerLines(logs).map((l) => l.text);

  const cardId = await page.evaluate(() => {
    const c = [...document.querySelectorAll("[data-testid^=card-]")].find((e) =>
      e.textContent.includes("Bai tap demo TH02"),
    );
    return c?.getAttribute("data-testid").replace("card-", "");
  });
  results.cardId = cardId;

  logs.length = 0;
  await page.click(`#toggle-${cardId}`);
  await sleep(400);
  await shot(page, "04a-after-complete");
  await consoleImage("04-console-complete", "Hoàn thành bài tập (toggleComplete)", loggerLines(logs));
  results.logComplete = loggerLines(logs).map((l) => l.text);

  logs.length = 0;
  await page.click(`#delete-${cardId}`);
  await sleep(400);
  await shot(page, "05a-after-delete");
  await consoleImage("05-console-delete", "Xoá bài tập (deleteAssignment)", loggerLines(logs));
  results.logDelete = loggerLines(logs).map((l) => l.text);

  // Ghim: bài ghim lên đầu
  const firstBefore = await page.$eval("[data-testid^=card-]", (e) => e.textContent.slice(0, 40));
  const cards = await page.$$("[data-testid^=card-]");
  const lastPin = await cards[cards.length - 1].$("button[aria-label=Ghim]");
  await lastPin.click();
  await sleep(300);
  await shot(page, "06-pinned-on-top");
  results.pin = {
    firstBefore,
    firstAfter: await page.$eval("[data-testid^=card-]", (e) => e.textContent.slice(0, 40)),
  };

  // Theme: đếm render của card
  await resetCounter(page);
  await page.click("#btn-theme");
  await sleep(500);
  results.themeCardRenders = await counter(page);
  await shot(page, "07-dark-theme");
  await page.click("#btn-theme");

  // Lazy stats
  const before = requests.length;
  await page.click("#tab-stats");
  await sleep(1000);
  results.lazyRequests = requests.slice(before).filter((u) => /StatsPage/.test(u));
  await shot(page, "08-stats-page");
  await page.close();
}

// ---------- 2. Stress test: baseline vs optimized ----------
async function stress(mode) {
  const url = mode === "baseline" ? `${BASE}/?perf=baseline` : `${BASE}/`;
  const { page } = await newPage(url);
  await page.waitForSelector("[data-testid^=card-]");
  const t0 = Date.now();
  await page.click("#btn-stress");
  await page.waitForFunction(
    () => document.body.textContent.includes("Bài tập mẫu số"),
    { timeout: 180000 },
  );
  const generateMs = Date.now() - t0;
  await sleep(1500);
  const domCards = await page.evaluate(() => document.querySelectorAll("[data-testid^=card-]").length);
  await shot(page, `09-stress-${mode}`);
  await resetCounter(page);
  const t1 = Date.now();
  await page.type("#search", "123", { delay: 150 });
  await page.waitForFunction(
    () => document.querySelector("#search").value === "123",
  );
  await sleep(mode === "baseline" ? 3000 : 1000);
  // đợi cho UI ổn định
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));
  const typeMs = Date.now() - t1;
  const renders = await counter(page);
  const domAfter = await page.evaluate(() => document.querySelectorAll("[data-testid^=card-]").length);
  await shot(page, `10-search-${mode}`);
  await page.close();
  return { generateMs, domCards, renders, typeMs, domAfter };
}
results.baseline = await stress("baseline");
results.optimized = await stress("optimized");

fs.writeFileSync("docs/measure-results.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
