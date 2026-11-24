import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One pickup line, spoken by a vending machine to a passing human:
// exact change, coils, and the moment everything adds up.
const line =
  "You must be exact change — the moment you walked by, everything in me finally added up, and my coils haven't stopped spinning since.";

const MAX_CHARS = 200;

function gate(text: string): void {
  const chars = [...text];
  if (chars.length < 1 || chars.length > MAX_CHARS) {
    throw new Error(
      `entry line must be 1-${MAX_CHARS} characters, got ${chars.length}`,
    );
  }
  if (text.trim() !== text || text.includes("\n")) {
    throw new Error("entry line must be a single unpadded line");
  }
  // No control characters: the line must be plain speakable text.
  for (const ch of chars) {
    if (ch.charCodeAt(0) < 0x20) {
      throw new Error("entry line must not contain control characters");
    }
  }
}

gate(line);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = `${outDir}/entry.txt`;
writeFileSync(outPath, line, "utf8");

// Read it back: what lands on disk must be exactly the gated line.
if (readFileSync(outPath, "utf8") !== line) {
  throw new Error("entry.txt on disk does not match the gated line");
}
