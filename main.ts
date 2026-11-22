import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { deflateSync } from "node:zlib";

const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
const outputFile = join(outputDir, "entry.png");
mkdirSync(outputDir, { recursive: true });

// --- 5x7 BITMAP FONT DATA (ASCII 32 to 126) ---
const FONT_5X7: Record<string, number[]> = {
  ' ': [0, 0, 0, 0, 0],
  '!': [0x00, 0x00, 0x5f, 0x00, 0x00],
  '"': [0x00, 0x07, 0x00, 0x07, 0x00],
  '#': [0x14, 0x7f, 0x14, 0x7f, 0x14],
  '$': [0x24, 0x2a, 0x7f, 0x2a, 0x12],
  '%': [0x23, 0x13, 0x08, 0x64, 0x62],
  '&': [0x36, 0x49, 0x55, 0x22, 0x50],
  '\'': [0x00, 0x05, 0x03, 0x00, 0x00],
  '(': [0x00, 0x1c, 0x22, 0x41, 0x00],
  ')': [0x00, 0x41, 0x22, 0x1c, 0x00],
  '*': [0x14, 0x08, 0x3e, 0x08, 0x14],
  '+': [0x08, 0x08, 0x3e, 0x08, 0x08],
  ',': [0x00, 0x50, 0x30, 0x00, 0x00],
  '-': [0x08, 0x08, 0x08, 0x08, 0x08],
  '.': [0x00, 0x60, 0x60, 0x00, 0x00],
  '/': [0x20, 0x10, 0x08, 0x04, 0x02],
  '0': [0x3e, 0x51, 0x49, 0x45, 0x3e],
  '1': [0x00, 0x42, 0x7f, 0x40, 0x00],
  '2': [0x42, 0x61, 0x51, 0x49, 0x46],
  '3': [0x21, 0x41, 0x45, 0x4b, 0x31],
  '4': [0x18, 0x14, 0x12, 0x7f, 0x10],
  '5': [0x27, 0x45, 0x45, 0x45, 0x39],
  '6': [0x3c, 0x4a, 0x49, 0x49, 0x30],
  '7': [0x01, 0x71, 0x09, 0x05, 0x03],
  '8': [0x36, 0x49, 0x49, 0x49, 0x36],
  '9': [0x06, 0x49, 0x49, 0x29, 0x1e],
  ':': [0x00, 0x36, 0x36, 0x00, 0x00],
  ';': [0x00, 0x56, 0x36, 0x00, 0x00],
  '<': [0x08, 0x14, 0x22, 0x41, 0x00],
  '=': [0x14, 0x14, 0x14, 0x14, 0x14],
  '>': [0x00, 0x41, 0x22, 0x14, 0x08],
  '?': [0x02, 0x01, 0x51, 0x09, 0x06],
  '@': [0x32, 0x49, 0x79, 0x41, 0x3e],
  'A': [0x7e, 0x11, 0x11, 0x11, 0x7e],
  'B': [0x7f, 0x49, 0x49, 0x49, 0x36],
  'C': [0x3e, 0x41, 0x41, 0x41, 0x22],
  'D': [0x7f, 0x41, 0x41, 0x22, 0x1c],
  'E': [0x7f, 0x49, 0x49, 0x49, 0x41],
  'F': [0x7f, 0x09, 0x09, 0x09, 0x01],
  'G': [0x3e, 0x41, 0x49, 0x49, 0x7a],
  'H': [0x7f, 0x08, 0x08, 0x08, 0x7f],
  'I': [0x00, 0x41, 0x7f, 0x41, 0x00],
  'J': [0x20, 0x40, 0x41, 0x3f, 0x01],
  'K': [0x7f, 0x08, 0x14, 0x22, 0x41],
  'L': [0x7f, 0x40, 0x40, 0x40, 0x40],
  'M': [0x7f, 0x02, 0x0c, 0x02, 0x7f],
  'N': [0x7f, 0x04, 0x08, 0x10, 0x7f],
  'O': [0x3e, 0x41, 0x41, 0x41, 0x3e],
  'P': [0x7f, 0x09, 0x09, 0x09, 0x06],
  'Q': [0x3e, 0x41, 0x51, 0x21, 0x5e],
  'R': [0x7f, 0x09, 0x19, 0x29, 0x46],
  'S': [0x26, 0x49, 0x49, 0x49, 0x32],
  'T': [0x01, 0x01, 0x7f, 0x01, 0x01],
  'U': [0x3f, 0x40, 0x40, 0x40, 0x3f],
  'V': [0x1f, 0x20, 0x40, 0x20, 0x1f],
  'W': [0x3f, 0x40, 0x30, 0x40, 0x3f],
  'X': [0x41, 0x22, 0x1c, 0x22, 0x41],
  'Y': [0x01, 0x02, 0x7c, 0x02, 0x01],
  'Z': [0x33, 0x45, 0x49, 0x51, 0x63],
  '[': [0x00, 0x7f, 0x41, 0x41, 0x00],
  '\\': [0x02, 0x04, 0x08, 0x10, 0x20],
  ']': [0x00, 0x41, 0x41, 0x7f, 0x00],
  '^': [0x04, 0x02, 0x01, 0x02, 0x04],
  '_': [0x80, 0x80, 0x80, 0x80, 0x80],
  '`': [0x00, 0x01, 0x02, 0x00, 0x00],
  '•': [0x08, 0x1c, 0x3e, 0x1c, 0x08],
};

// Map lowercase to uppercase for robustness
for (let c = 97; c <= 122; c++) {
  const upperCh = String.fromCharCode(c - 32);
  const lowerCh = String.fromCharCode(c);
  if (FONT_5X7[upperCh]) {
    FONT_5X7[lowerCh] = FONT_5X7[upperCh];
  }
}

class Canvas {
  width: number;
  height: number;
  pixels: Uint8Array;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.pixels = new Uint8Array(width * height * 3);
  }

  fill(r: number, g: number, b: number) {
    for (let i = 0; i < this.pixels.length; i += 3) {
      this.pixels[i] = r;
      this.pixels[i+1] = g;
      this.pixels[i+2] = b;
    }
  }

  setPixel(x: number, y: number, r: number, g: number, b: number) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const idx = (y * this.width + x) * 3;
    this.pixels[idx] = r;
    this.pixels[idx+1] = g;
    this.pixels[idx+2] = b;
  }

  fillRect(x: number, y: number, w: number, h: number, r: number, g: number, b: number) {
    const x0 = Math.max(0, Math.floor(x));
    const y0 = Math.max(0, Math.floor(y));
    const x1 = Math.min(this.width, Math.floor(x + w));
    const y1 = Math.min(this.height, Math.floor(y + h));
    for (let py = y0; py < y1; py++) {
      const rowOffset = py * this.width * 3;
      for (let px = x0; px < x1; px++) {
        const idx = rowOffset + px * 3;
        this.pixels[idx] = r;
        this.pixels[idx+1] = g;
        this.pixels[idx+2] = b;
      }
    }
  }

  strokeRect(x: number, y: number, w: number, h: number, r: number, g: number, b: number, lineWidth: number = 1) {
    this.fillRect(x, y, w, lineWidth, r, g, b);
    this.fillRect(x, y + h - lineWidth, w, lineWidth, r, g, b);
    this.fillRect(x, y, lineWidth, h, r, g, b);
    this.fillRect(x + w - lineWidth, y, lineWidth, h, r, g, b);
  }

  drawLine(x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number, width: number = 1) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;
    let cx = x0;
    let cy = y0;
    while (true) {
      if (width === 1) {
        this.setPixel(cx, cy, r, g, b);
      } else {
        this.fillRect(cx - Math.floor(width/2), cy - Math.floor(width/2), width, width, r, g, b);
      }
      if (cx === x1 && cy === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        cx += sx;
      }
      if (e2 < dx) {
        err += dx;
        cy += sy;
      }
    }
  }

  drawText(text: string, x: number, y: number, scale: number, [r, g, b]: [number, number, number], align: 'left' | 'center' | 'right' = 'left') {
    const charWidth = (5 + 1) * scale;
    const totalWidth = text.length * charWidth;
    let startX = x;
    if (align === 'center') startX = x - Math.floor(totalWidth / 2);
    else if (align === 'right') startX = x - totalWidth;

    let cursorX = startX;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const glyph = FONT_5X7[ch] || FONT_5X7[ch.toUpperCase()] || FONT_5X7['?'] || [0x7f,0x41,0x41,0x41,0x7f];
      for (let col = 0; col < 5; col++) {
        const colBits = glyph[col];
        for (let row = 0; row < 7; row++) {
          if ((colBits & (1 << row)) !== 0) {
            this.fillRect(cursorX + col * scale, y + row * scale, scale, scale, r, g, b);
          }
        }
      }
      cursorX += charWidth;
    }
  }

  drawWrappedText(text: string, x: number, y: number, maxWidth: number, scale: number, color: [number, number, number], lineHeight: number): number {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    const charWidth = (5 + 1) * scale;

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      if (testLine.length * charWidth > maxWidth && line) {
        this.drawText(line, x, currentY, scale, color);
        line = word;
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      this.drawText(line, x, currentY, scale, color);
      currentY += lineHeight;
    }
    return currentY;
  }
}

// --- PNG ENCODER ---
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const temp = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(temp), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width: number, height: number, rgbPixels: Uint8Array): Buffer {
  const rowSize = width * 3;
  const filtered = Buffer.alloc(height * (rowSize + 1));
  for (let y = 0; y < height; y++) {
    filtered[y * (rowSize + 1)] = 0;
    filtered.set(rgbPixels.subarray(y * rowSize, (y + 1) * rowSize), y * (rowSize + 1) + 1);
  }
  const compressed = deflateSync(filtered, { level: 6 });
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2; // RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

// --- RENDER NEWSPAPER ---
const canvas = new Canvas(1024, 1024);

// 1. Paper background
canvas.fill(247, 242, 231);

// 2. Outer border
canvas.strokeRect(20, 18, 984, 988, 23, 42, 49, 3);

// 3. Header straps & masthead
canvas.drawText("THE DAILY WORLD BRIEFING • VERIFIED HEADLINES", 42, 48, 1, [164, 66, 50]);
canvas.drawText("THE WORLD LEDGER", 512, 75, 4, [20, 38, 46], 'center');
canvas.drawText("SATURDAY 21 NOVEMBER 2026  •  ONE DAY, ONE WORLD", 512, 105, 1, [53, 83, 93], 'center');
canvas.drawLine(42, 119, 982, 119, 23, 42, 49, 2);
canvas.drawText("FRONT PAGE", 42, 143, 1, [164, 66, 50]);
canvas.drawText("POLAND • MARKETS • PERU • WORLD AFFAIRS", 982, 143, 1, [53, 83, 93], 'right');

// --- LEAD 1: POLAND AIRSPACE ---
canvas.fillRect(42, 162, 454, 310, 220, 230, 225);
canvas.strokeRect(42, 162, 454, 310, 23, 42, 49, 2);
canvas.fillRect(42, 162, 454, 30, 26, 52, 61);
canvas.drawText("EUROPE / AIRSPACE", 56, 172, 1, [247, 242, 231]);

canvas.fillRect(42, 192, 454, 258, 126, 156, 136);
canvas.drawLine(42, 280, 120, 240, 82, 117, 108, 4);
canvas.drawLine(120, 240, 220, 290, 82, 117, 108, 4);
canvas.drawLine(220, 290, 340, 230, 82, 117, 108, 4);
canvas.drawLine(340, 230, 496, 280, 82, 117, 108, 4);
canvas.drawLine(150, 220, 280, 180, 186, 75, 62, 3);
canvas.drawLine(260, 190, 290, 170, 245, 216, 122, 2);
canvas.drawText("ILLUSTRATION: MISSILES AND A SUSPECTED DRONE", 52, 450, 1, [70, 97, 106]);

canvas.drawText("NATO ALLY REQUESTS SUPPORT", 42, 482, 1, [164, 66, 50]);
let nextY = canvas.drawWrappedText("RUSSIAN MISSILES HIT POLAND IN OVERNIGHT AIRSPACE BREACH", 42, 498, 454, 2, [19, 36, 43], 18);
canvas.drawWrappedText("Poland calls the incident a deliberate provocation; NATO calls it a grave violation of its airspace.", 42, nextY + 6, 454, 1, [51, 71, 77], 14);

// --- LEAD 2: MARKETS SELLOFF ---
canvas.fillRect(528, 162, 454, 310, 20, 45, 54);
canvas.strokeRect(528, 162, 454, 310, 23, 42, 49, 2);
canvas.fillRect(528, 162, 454, 30, 164, 66, 50);
canvas.drawText("GLOBAL / MARKETS", 542, 172, 1, [247, 242, 231]);

for (let y = 210; y < 440; y += 35) {
  canvas.drawLine(548, y, 962, y, 49, 80, 90, 1);
}
for (let x = 580; x < 960; x += 75) {
  canvas.drawLine(x, 200, x, 450, 49, 80, 90, 1);
}
canvas.drawLine(548, 220, 620, 230, 240, 93, 78, 4);
canvas.drawLine(620, 230, 710, 260, 240, 93, 78, 4);
canvas.drawLine(710, 260, 810, 310, 240, 93, 78, 4);
canvas.drawLine(810, 310, 962, 420, 240, 93, 78, 4);
canvas.drawText("AI TRADE SELLOFF - S&P 500 & NASDAQ CORRECTION", 542, 195, 1, [238, 241, 231]);
canvas.drawText("SEVENTH STRAIGHT S&P 500 LOSS • NASDAQ ERASES GAIN", 542, 450, 1, [183, 199, 199]);

canvas.drawText("SEVENTH STRAIGHT S&P 500 DECLINE", 528, 482, 1, [164, 66, 50]);
nextY = canvas.drawWrappedText("WALL STREET ENTERS CORRECTION AS AI STOCKS PLUNGE", 528, 498, 454, 2, [19, 36, 43], 18);
canvas.drawWrappedText("S&P 500 falls 3.70%; Nasdaq drops 5.28%. Nvidia closes about 14% lower after an SEC accounting report.", 528, nextY + 6, 454, 1, [51, 71, 77], 14);

// --- AROUND THE WORLD SECTION ---
canvas.drawLine(42, 594, 982, 594, 23, 42, 49, 2);
canvas.drawText("AROUND THE WORLD", 42, 617, 1, [164, 66, 50]);

type Brief = { section: string; title: string; note: string };
const briefs: Brief[] = [
  { section: "AMERICAS / DISASTER", title: "Magnitude 6.8 earthquake strikes central Peru", note: "Tremors from the Junin quake were felt in Lima, about 320 km away." },
  { section: "ASIA / LAW", title: "World Court says Myanmar committed genocide against Rohingya", note: "Myanmar and China object; Switzerland calls the ICJ ruling a step for justice." },
  { section: "EUROPE / POLITICS", title: "UK and EU sign food, carbon and youth-mobility deals", note: "Burnham seals three agreements at the Brussels summit." },
  { section: "MIDDLE EAST / WAR", title: "Saudi coalition says it intercepted missiles over Riyadh", note: "Coalition also strikes Hodeidah after its special operation." },
  { section: "AMERICAS / TECH", title: "US approved nearly 900,000 AI-chip exports to China", note: "House committee cites Nvidia and AMD shipments in six months." },
  { section: "RUSSIA / DISASTER", title: "Military transport plane crash kills all 19 aboard", note: "Aircraft came down in an unpopulated area of western Siberia." },
];

function drawCard(b: Brief, x: number, y: number) {
  canvas.fillRect(x, y, 307, 112, 251, 248, 240);
  canvas.strokeRect(x, y, 307, 112, 182, 193, 188, 1);
  canvas.drawText(b.section, x + 12, y + 12, 1, [164, 66, 50]);
  canvas.drawWrappedText(b.title, x + 12, y + 26, 283, 1, [20, 39, 46], 12);
  canvas.drawWrappedText(b.note, x + 12, y + 68, 283, 1, [70, 89, 93], 11);
}

const cardXCoords = [42, 358, 674];
briefs.slice(0, 3).forEach((b, i) => drawCard(b, cardXCoords[i], 630));
briefs.slice(3, 6).forEach((b, i) => drawCard(b, cardXCoords[i], 754));

// --- FOOTER ---
canvas.drawLine(42, 893, 982, 893, 120, 144, 152, 1);
canvas.drawText("THE WORLD LEDGER  •  SATURDAY 21 NOVEMBER 2026  •  A VISUAL SUMMARY OF THE DAY'S REPORTED NEWS", 42, 918, 1, [80, 104, 109]);
canvas.drawText("NEWS IMAGE EDITION", 982, 918, 1, [80, 104, 109], 'right');

// --- ENCODE & WRITE ---
const rgbBuffer = canvas.pixels;
const pngBuffer = encodePNG(1024, 1024, rgbBuffer);

if (pngBuffer.length > 1024 * 1024) {
  throw new Error(`Generated PNG is too large: ${pngBuffer.length} bytes`);
}

writeFileSync(outputFile, pngBuffer);
const finalSize = statSync(outputFile).size;
console.log(`Wrote ${outputFile} (${finalSize} bytes) successfully.`);
