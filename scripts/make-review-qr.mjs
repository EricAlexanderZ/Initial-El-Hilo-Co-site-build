/**
 * Generate the QR code for the printed thank-you cards.
 *
 * Run: node scripts/make-review-qr.mjs
 *
 * The code points at our own /review page, never directly at Google. A printed
 * QR cannot be edited: if Google changes its review URL or the listing is ever
 * recreated, cards pointing straight at Google become waste paper. Pointing at
 * our own path keeps the destination one line of config away, and every card
 * already in a customer's hand keeps working.
 *
 * Error correction is set to H (~30% recoverable). Thank-you cards get thumbed,
 * folded and rained on, and H is what lets a scuffed code still scan. It costs
 * density, which is affordable because the URL is short.
 */
import QRCode from "qrcode";
import fs from "node:fs";

const TARGET = "https://brandfirstmerch.com/review";
const OUT_DIR = "public/images/brand";

const common = {
  errorCorrectionLevel: "H",
  margin: 2,              // quiet zone, in modules. Below 2 scanners struggle.
  color: { dark: "#13294bff", light: "#ffffffff" },
};

// SVG for print: vector, so it stays crisp at any card size.
const svg = await QRCode.toString(TARGET, { ...common, type: "svg", width: 1024 });
fs.writeFileSync(`${OUT_DIR}/review-qr.svg`, svg);

// PNG at 2048px for designers who want a raster. At a 1 inch print that is
// well past 300dpi, so it survives being scaled down.
await QRCode.toFile(`${OUT_DIR}/review-qr.png`, TARGET, { ...common, width: 2048 });

const kb = (f) => (fs.statSync(f).size / 1024).toFixed(1) + "KB";
console.log(`target : ${TARGET}`);
console.log(`svg    : ${OUT_DIR}/review-qr.svg  ${kb(`${OUT_DIR}/review-qr.svg`)}`);
console.log(`png    : ${OUT_DIR}/review-qr.png  ${kb(`${OUT_DIR}/review-qr.png`)}  2048x2048`);
