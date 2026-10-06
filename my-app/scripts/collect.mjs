import puppeteer from "puppeteer-core";
import fs from "node:fs";
import { execSync } from "node:child_process";

const out = {};
for (const m of ["baseline", "optimized"]) {
  const j = JSON.parse(fs.readFileSync(`docs/lighthouse-${m}.report.json`, "utf8"));
  const a = j.audits;
  out[m] = {
    score: Math.round(j.categories.performance.score * 100),
    FCP: a["first-contentful-paint"].displayValue,
    LCP: a["largest-contentful-paint"].displayValue,
    TBT: a["total-blocking-time"].displayValue,
    CLS: a["cumulative-layout-shift"].displayValue,
    SI: a["speed-index"].displayValue,
    dom: a["dom-size"].displayValue,
  };
}
fs.writeFileSync("docs/lighthouse-summary.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));

const b = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  defaultViewport: { width: 1100, height: 900 },
});
for (const m of ["baseline", "optimized"]) {
  const p = await b.newPage();
  await p.goto("file:///" + process.cwd().replace(/\\/g, "/") + `/docs/lighthouse-${m}.report.html`);
  await new Promise((r) => setTimeout(r, 1500));
  await p.screenshot({ path: `docs/images/11-lighthouse-${m}.png` });
  await p.close();
}

// Ảnh kết quả jest
const jest = execSync("npx jest --coverage --colors=false 2>&1", { encoding: "utf8" });
fs.writeFileSync("docs/jest-output.txt", jest);
const html = `<body style="margin:0;background:#0c0c0c;color:#ddd;font:13px Consolas,monospace"><div style="background:#2d2d2d;padding:6px 12px">PS my-app&gt; npm test -- --coverage</div><pre style="padding:12px;margin:0">${jest.replace(/</g, "&lt;")}</pre></body>`;
const p = await b.newPage();
await p.setViewport({ width: 1000, height: 900 });
await p.setContent(html);
await p.screenshot({ path: "docs/images/12-jest-coverage.png", fullPage: true });
await b.close();
