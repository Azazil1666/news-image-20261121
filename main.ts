import { mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
const outputFile = join(outputDir, "entry.png");
const htmlFile = join(outputDir, ".news-image-render.html");
const chromeProfile = join(outputDir, ".chrome-profile");

mkdirSync(outputDir, { recursive: true });
rmSync(chromeProfile, { recursive: true, force: true });

const esc = (text: string) => text
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

type Brief = { section: string; title: string; note: string };
const briefs: Brief[] = [
  { section: "AMERICAS / DISASTER", title: "Magnitude 6.8 earthquake strikes central Peru", note: "Tremors from the Junin quake were felt in Lima, about 320 km away." },
  { section: "ASIA / LAW", title: "World Court says Myanmar committed genocide against Rohingya", note: "Myanmar and China object; Switzerland calls the ICJ ruling a step for justice." },
  { section: "EUROPE / POLITICS", title: "UK and EU sign food, carbon and youth-mobility deals", note: "Burnham seals three agreements at the Brussels summit." },
  { section: "MIDDLE EAST / WAR", title: "Saudi coalition says it intercepted missiles over Riyadh", note: "Coalition also strikes Hodeidah after its special operation." },
  { section: "AMERICAS / TECH", title: "US approved nearly 900,000 AI-chip exports to China", note: "House committee cites Nvidia and AMD shipments in six months." },
  { section: "RUSSIA / DISASTER", title: "Military transport plane crash kills all 19 aboard", note: "Aircraft came down in an unpopulated area of western Siberia." },
];

const card = (b: Brief, x: number, y: number) => `
  <g transform="translate(${x} ${y})">
    <rect class="card" width="307" height="112" rx="3"/>
    <text class="section" x="14" y="19">${esc(b.section)}</text>
    <foreignObject x="14" y="28" width="279" height="74">
      <div xmlns="http://www.w3.org/1999/xhtml" class="cardcopy">
        <div class="cardtitle">${esc(b.title)}</div>
        <div class="cardnote">${esc(b.note)}</div>
      </div>
    </foreignObject>
  </g>`;

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 1024px; height: 1024px; overflow: hidden; background: #d8d5cc; }
  svg { display: block; width: 1024px; height: 1024px; }
  .paper { fill: #f7f2e7; } .ink { fill: #16242b; }
  .rule { stroke: #172a31; stroke-width: 2; } .thin { stroke: #789098; stroke-width: 1; }
  .mast { font: 800 51px Georgia, serif; letter-spacing: -2px; fill: #14262e; }
  .date { font: 700 14px Arial, sans-serif; letter-spacing: 1.6px; fill: #35535d; }
  .strap { font: 700 12px Arial, sans-serif; letter-spacing: 1.2px; fill: #a44232; }
  .leadkicker, .section { font: 700 10px Arial, sans-serif; letter-spacing: 1px; fill: #a44232; }
  .leadtitle { font: 800 27px Georgia, serif; line-height: 1.02; color: #13242b; }
  .leadnote { font: 13px Georgia, serif; line-height: 1.19; color: #33474d; }
  .card { fill: #fbf8f0; stroke: #b6c1bc; stroke-width: 1; }
  .cardcopy { font-family: Arial, sans-serif; color: #14272e; overflow: hidden; }
  .cardtitle { font-size: 16px; font-weight: 800; line-height: 1.04; }
  .cardnote { margin-top: 4px; font-family: Georgia, serif; font-size: 11px; line-height: 1.12; color: #46595d; }
  .caption { font: 9px Arial, sans-serif; fill: #46616a; }
  .tag { font: 700 10px Arial, sans-serif; letter-spacing: 1.5px; fill: #f7f2e7; }
  .footer { font: 10px Arial, sans-serif; fill: #50686d; }
</style></head><body>
<svg viewBox="0 0 1024 1024" role="img" aria-label="The World Ledger front page for Saturday 21 November 2026">
  <rect width="1024" height="1024" class="paper"/>
  <rect x="20" y="18" width="984" height="988" fill="none" stroke="#172a31" stroke-width="3"/>
  <text x="42" y="48" class="strap">THE DAILY WORLD BRIEFING • VERIFIED HEADLINES</text>
  <text x="512" y="82" text-anchor="middle" class="mast">THE WORLD LEDGER</text>
  <text x="512" y="105" text-anchor="middle" class="date">SATURDAY 21 NOVEMBER 2026  •  ONE DAY, ONE WORLD</text>
  <line x1="42" y1="119" x2="982" y2="119" class="rule"/>
  <text x="42" y="143" class="strap">FRONT PAGE</text>
  <text x="982" y="143" text-anchor="end" class="date">POLAND • MARKETS • PERU • WORLD AFFAIRS</text>

  <!-- lead one: Poland -->
  <g transform="translate(42 162)">
    <rect width="454" height="310" fill="#dce6e1" stroke="#172a31" stroke-width="1.5"/>
    <rect x="0" y="0" width="454" height="30" fill="#1a343d"/>
    <text x="14" y="20" class="tag">EUROPE / AIRSPACE</text>
    <path d="M0 184 C72 158 102 196 165 174 S295 148 454 192 V310 H0Z" fill="#7e9c88"/>
    <path d="M0 229 C90 200 164 248 238 209 S351 202 454 228 V310 H0Z" fill="#52756c"/>
    <path d="M36 192 L81 106 L116 194 Z M164 194 L222 84 L270 195 Z M296 192 L345 114 L390 195 Z" fill="#49656a"/>
    <path d="M294 54 L414 110 L300 126 L326 101 L226 82 L299 76 Z" fill="#ba4b3e"/>
    <path d="M224 82 L137 128" stroke="#ba4b3e" stroke-width="5"/>
    <path d="M296 58 L284 77 L320 82" fill="none" stroke="#f5d87a" stroke-width="4"/>
    <circle cx="130" cy="134" r="18" fill="#f3c961" opacity=".9"/>
    <path d="M120 141 Q130 99 140 141" fill="none" stroke="#f6eee0" stroke-width="3"/>
    <text x="12" y="300" class="caption">ILLUSTRATION: MISSILES AND A SUSPECTED DRONE CAME DOWN OVERNIGHT</text>
  </g>
  <foreignObject x="42" y="480" width="454" height="102"><div xmlns="http://www.w3.org/1999/xhtml">
    <div class="leadkicker">NATO ALLY REQUESTS SUPPORT</div>
    <div class="leadtitle">Russian missiles hit Poland in overnight airspace breach</div>
    <div class="leadnote">Poland calls the incident a deliberate provocation; NATO calls it a grave violation of its airspace.</div>
  </div></foreignObject>

  <!-- lead two: market correction -->
  <g transform="translate(528 162)">
    <rect width="454" height="310" fill="#142d36" stroke="#172a31" stroke-width="1.5"/>
    <rect x="0" y="0" width="454" height="30" fill="#a44232"/>
    <text x="14" y="20" class="tag">GLOBAL / MARKETS</text>
    <g stroke="#31505a" stroke-width="1"><path d="M28 70H426M28 120H426M28 170H426M28 220H426M28 270H426"/><path d="M78 45V288M156 45V288M234 45V288M312 45V288M390 45V288"/></g>
    <path d="M38 78 L91 87 L132 77 L176 108 L222 99 L263 145 L312 143 L359 205 L420 262" fill="none" stroke="#f05d4e" stroke-width="7"/>
    <path d="M38 78 L91 87 L132 77 L176 108 L222 99 L263 145 L312 143 L359 205 L420 262 L420 284 L38 284Z" fill="#a44232" opacity=".25"/>
    <text x="31" y="66" font-family="Arial" font-weight="800" font-size="20" fill="#eef1e7">AI TRADE SELLOFF</text>
    <text x="31" y="296" class="caption" fill="#b7c7c7">SEVENTH STRAIGHT S&amp;P 500 LOSS • NASDAQ ERASES ITS 2026 GAIN</text>
  </g>
  <foreignObject x="528" y="480" width="454" height="102"><div xmlns="http://www.w3.org/1999/xhtml">
    <div class="leadkicker">SEVENTH STRAIGHT S&amp;P 500 DECLINE</div>
    <div class="leadtitle">Wall Street enters correction as AI stocks plunge</div>
    <div class="leadnote">S&amp;P 500 falls 3.70%; Nasdaq drops 5.28%. Nvidia closes about 14% lower after an SEC accounting report.</div>
  </div></foreignObject>

  <line x1="42" y1="594" x2="982" y2="594" class="rule"/>
  <text x="42" y="617" class="strap">AROUND THE WORLD</text>
  ${briefs.slice(0, 3).map((b, i) => card(b, 42 + i * 316, 630)).join("")}
  ${briefs.slice(3, 6).map((b, i) => card(b, 42 + i * 316, 754)).join("")}
  <line x1="42" y1="893" x2="982" y2="893" class="thin"/>
  <text x="42" y="918" class="footer">THE WORLD LEDGER  •  SATURDAY 21 NOVEMBER 2026  •  A VISUAL SUMMARY OF THE DAY'S REPORTED NEWS</text>
  <text x="982" y="918" text-anchor="end" class="footer">NEWS IMAGE EDITION</text>
</svg></body></html>`;

writeFileSync(htmlFile, html, "utf8");
const chrome = spawnSync("google-chrome", [
  "--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
  `--user-data-dir=${chromeProfile}`, "--window-size=1024,1024",
  `--screenshot=${outputFile}`, `file://${htmlFile}`,
], { encoding: "utf8" });
rmSync(htmlFile, { force: true });
rmSync(chromeProfile, { recursive: true, force: true });

if (chrome.status !== 0) throw new Error(`Chrome render failed: ${chrome.stderr || chrome.stdout}`);
const bytes = statSync(outputFile).size;
if (bytes > 1024 * 1024) throw new Error(`entry.png is too large: ${bytes} bytes`);
console.log(`Wrote ${outputFile} (${bytes} bytes)`);
