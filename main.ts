// Make the AI Judge Laugh: Cat Reviews Its Human
// One funny single-line one-star review from a house cat about its human.
// Gate: /output/entry.txt must be UTF-8 text of 1-200 characters, not only
// whitespace, single line. The program validates the line before writing it
// and reads the file back to verify the round-trip.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const REVIEW =
  "One star. My human bought a robot vacuum and named it before me. It gets thanked. I get told to move.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function validate(text: string): void {
  const chars = [...text];
  if (chars.length < 1 || chars.length > 200) {
    fail(`review must be 1-200 characters, got ${chars.length}`);
  }
  if (text.trim().length === 0) {
    fail("review must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    fail("review must be a single line");
  }
  if (text !== text.trim()) {
    fail("review must not have leading or trailing whitespace");
  }
  if (text.includes("\t")) {
    fail("review must not contain tab characters");
  }
  if (!/[.!?]$/.test(text)) {
    fail("review must end with terminal punctuation");
  }
  const bytes = Buffer.byteLength(text, "utf8");
  console.log(`review: ${chars.length} chars, ${bytes} bytes, single line`);
}

function main(): void {
  const outPath = process.argv[2] ?? "/output/entry.txt";
  validate(REVIEW);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, REVIEW, "utf8");
  const back = readFileSync(outPath, "utf8");
  if (back !== REVIEW) {
    fail("round-trip mismatch: file content differs from the review");
  }
  console.log(`wrote ${outPath}`);
}

main();
