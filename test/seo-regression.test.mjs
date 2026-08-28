import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), "utf8");
}

test("SEO uses the production booking stadium URL consistently", () => {
  const seoSource = readProjectFile("lib/seo.ts");
  const layoutSource = readProjectFile("app/layout.tsx");
  const robotsSource = readProjectFile("app/robots.ts");
  const sitemapSource = readProjectFile("app/sitemap.ts");

  assert.match(seoSource, /SITE_URL\s*=\s*"https:\/\/booking-stadium\.vercel\.app"/);
  assert.match(layoutSource, /metadataBase:\s*new URL\(SITE_URL\)/);
  assert.match(robotsSource, /sitemap:\s*absoluteUrl\("\/sitemap\.xml"\)/);
  assert.match(robotsSource, /host:\s*SITE_URL/);
  assert.doesNotMatch(sitemapSource, /https:\/\/booking-stadium\.vercel\.app/);
});

test("public SEO pages expose canonical metadata", () => {
  const seoSource = readProjectFile("lib/seo.ts");
  const pages = [
    ["app/(client)/page.tsx", "/"],
    ["app/(client)/stadiums/page.tsx", "/stadiums"],
    ["app/(client)/map/page.tsx", "/map"],
  ];

  assert.match(seoSource, /alternates:\s*{/);
  assert.match(seoSource, /canonical:\s*pathname/);
  assert.match(seoSource, /openGraph:\s*{/);

  for (const [filePath, pathname] of pages) {
    const source = readProjectFile(filePath);

    assert.match(source, /publicPageMetadata/);
    assert.match(source, new RegExp(`pathname:\\s*"${pathname.replace("/", "\\/")}"`));
  }
});

test("auth and private pages are excluded from search indexing", () => {
  const pages = [
    "app/(auth)/login/page.tsx",
    "app/(auth)/register/page.tsx",
    "app/(auth)/forgot-password/page.tsx",
    "app/(client)/booked/page.tsx",
    "app/(client)/favorite/page.tsx",
    "app/(client)/me/page.tsx",
    "app/(protected-admin)/admin/layout.tsx",
    "app/admin/login/page.tsx",
    "app/checkout/page.tsx",
    "app/booking/detail/[id]/page.tsx",
    "app/booking/success/[id]/page.tsx",
  ];

  for (const filePath of pages) {
    const source = readProjectFile(filePath);

    assert.match(source, /robots:\s*{/);
    assert.match(source, /index:\s*false/);
    assert.match(source, /follow:\s*false/);
  }
});

test("stadium detail route generates SEO from stadium data", () => {
  const source = readProjectFile("app/(client)/stadiums/[slug]/page.tsx");

  assert.match(source, /export async function generateMetadata/);
  assert.match(source, /Array\.isArray\(stadiumData\)/);
  assert.match(source, /StadiumPageJsonLd/);
  assert.match(source, /publicPageMetadata/);
  assert.match(source, /pathname:\s*`\/stadiums\/\$\{slug\}`/);
});

test("dynamic sitemap only includes stadium detail URLs from array responses", () => {
  const source = readProjectFile("app/sitemap.ts");

  assert.match(source, /data\.stadiums\s*\?\?\s*data\.data\s*\?\?\s*\[\]/);
  assert.match(source, /Array\.isArray\(stadiums\)/);
  assert.match(source, /absoluteUrl\(`\/stadiums\/\$\{stadium\.slug\}`\)/);
});

test("robots excludes private and account routes", () => {
  const source = readProjectFile("app/robots.ts");

  for (const pathname of [
    "/admin/",
    "/login",
    "/register",
    "/forgot-password",
    "/checkout",
    "/booking/",
    "/booked",
    "/me",
    "/favorite",
  ]) {
    assert.match(source, new RegExp(`"${pathname.replace("/", "\\/")}"`));
  }
});

test("site identity metadata does not expose default Vercel branding", () => {
  const layoutSource = readProjectFile("app/layout.tsx");

  assert.match(layoutSource, /applicationName:\s*SITE_NAME/);
  assert.match(layoutSource, /icons:\s*{/);
  assert.match(layoutSource, /icon:\s*"\/logo\.png"/);
  assert.equal(fs.existsSync(path.join(rootDir, "app/favicon.ico")), false);
  assert.equal(fs.existsSync(path.join(rootDir, "public/logo1.png")), false);
  assert.equal(fs.existsSync(path.join(rootDir, "public/logoo.png")), false);
});
