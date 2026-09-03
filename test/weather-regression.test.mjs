import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import ts from "typescript";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(rootDir, "lib/weather.ts"), "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
});
const cjsModule = { exports: {} };
const sandbox = { exports: cjsModule.exports, module: cjsModule };

vm.runInNewContext(output.outputText, sandbox);

const { normalizeWeatherData, resolveWeatherData } = cjsModule.exports;

test("normalizeWeatherData falls back when the weather API omits current conditions", () => {
  assert.equal(JSON.stringify(normalizeWeatherData({})), JSON.stringify({
    interval: 0,
    precipitation_probability: 0,
    temperature_2m: 0,
    time: "",
    weather_code: 0,
  }));
});

test("normalizeWeatherData preserves complete current weather payloads", () => {
  const current = {
    interval: 900,
    precipitation_probability: 12,
    temperature_2m: 31.5,
    time: "2026-09-03T14:30",
    weather_code: 2,
  };

  assert.equal(JSON.stringify(normalizeWeatherData({ current })), JSON.stringify(current));
});

test("resolveWeatherData falls back when loading weather throws", async () => {
  const result = await resolveWeatherData(async () => {
    throw new Error("network unavailable");
  });

  assert.equal(JSON.stringify(result), JSON.stringify({
    interval: 0,
    precipitation_probability: 0,
    temperature_2m: 0,
    time: "",
    weather_code: 0,
  }));
});
