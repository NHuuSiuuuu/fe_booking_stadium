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

test("map page exposes a radius slider for nearby stadium search", () => {
  const source = readProjectFile("components/client/stadium/map-leaflet.tsx");

  assert.match(source, /const \[radius,\s*setRadius\] = useState\(10\)/);
  assert.match(source, /type="range"/);
  assert.match(source, /min="1"/);
  assert.match(source, /max="30"/);
  assert.match(source, /onChange=\{\(e\) => setRadius\(Number\(e\.target\.value\)\)\}/);
  assert.match(source, /params\.set\("radius", String\(radius\)\)/);
  assert.match(source, /radius \* 1000/);
});

test("mobile map list toggle is centered away from the chat button", () => {
  const source = readProjectFile("components/client/stadium/map-leaflet.tsx");

  assert.match(source, /md:hidden fixed bottom-10 left-1\/2/);
  assert.match(source, /-translate-x-1\/2/);
  assert.doesNotMatch(source, /md:hidden fixed bottom-10 right-4/);
});

test("mobile map list toggle arrow reflects the list state", () => {
  const source = readProjectFile("components/client/stadium/map-leaflet.tsx");

  assert.match(source, /FaArrowDown/);
  assert.match(source, /aria-label=\{showList \? "Ẩn danh sách sân" : "Hiện danh sách sân"\}/);
  assert.match(source, /showList \? \(\s*<FaArrowDown className="size-4" \/>/);
  assert.match(source, /<FaArrowUp className="size-4" \/>/);
});

test("site typography uses the shared Open Sans font token", () => {
  const layoutSource = readProjectFile("app/layout.tsx");
  const globalSource = readProjectFile("app/globals.css");

  assert.match(layoutSource, /variable:\s*"--font-sans"/);
  assert.match(layoutSource, /<body className=\{openSans\.variable\}>/);
  assert.match(globalSource, /font-family:\s*var\(--font-sans\)/);
  assert.match(globalSource, /font-size:\s*15px/);
  assert.match(globalSource, /line-height:\s*1\.6/);
  assert.doesNotMatch(layoutSource, /--font-geist-sans/);
});
