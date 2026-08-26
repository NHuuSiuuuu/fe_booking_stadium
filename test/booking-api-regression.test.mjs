import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), "utf8");
}

test("checkout posts booking creation through the Next.js API rewrite", () => {
  const source = readProjectFile("app/checkout/checkout-form.tsx");

  assert.match(source, /fetch\(`\/api\/booking\/create`/);
  assert.doesNotMatch(source, /fetch\(`api\/booking\/create`/);
});

test("booking sidebar validates the socket URL before opening a connection", () => {
  const source = readProjectFile("app/(client)/stadiums/[slug]/booking-sidebar.tsx");

  assert.match(source, /isValidSocketUrl/);
  assert.match(source, /socketUrl\.startsWith\("https:\/\/"\)/);
  assert.match(source, /socketUrl\.startsWith\("http:\/\/"\)/);
});
