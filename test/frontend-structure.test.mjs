import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), "utf8");
}

test("env example documents every required public environment variable", () => {
  const source = readProjectFile(".env.example");

  for (const key of [
    "NEXT_PUBLIC_API_ENDPOINT",
    "NEXT_PUBLIC_URL",
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_SOCKET_URL",
  ]) {
    assert.match(source, new RegExp(`^${key}=`, "m"));
  }
});

test("stadium-heavy components consume shared stadium API types", () => {
  const files = [
    "components/client/stadium/map-leaflet.tsx",
    "components/client/stadium/list-stadium.tsx",
    "app/(client)/stadiums/list-stadiums.tsx",
  ];

  for (const file of files) {
    const source = readProjectFile(file);
    assert.match(source, /@\/types\/stadium/);
    assert.doesNotMatch(source, /type StadiumsResponse\s*=/);
    assert.doesNotMatch(source, /total:\s*any/);
  }
});

test("stadium detail route exposes an immediate loading state", () => {
  const source = readProjectFile("app/(client)/stadiums/[slug]/loading.tsx");

  assert.match(source, /Đang tải sân/);
  assert.match(source, /animate-/);
});

test("stadium detail route resets scroll after delayed navigation", () => {
  const pageSource = readProjectFile("app/(client)/stadiums/[slug]/page.tsx");
  const scrollSource = readProjectFile(
    "app/(client)/stadiums/[slug]/scroll-to-top.tsx",
  );

  assert.match(pageSource, /ScrollToTop/);
  assert.match(scrollSource, /"use client"/);
  assert.match(scrollSource, /window\.scrollTo/);
  assert.match(scrollSource, /top:\s*0/);
});
