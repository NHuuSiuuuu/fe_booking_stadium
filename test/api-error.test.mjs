import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import ts from "typescript";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(rootDir, "lib/api-error.ts"), "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
});
const cjsModule = { exports: {} };
const sandbox = { exports: cjsModule.exports, module: cjsModule };

vm.runInNewContext(output.outputText, sandbox);

const { getApiErrorMessage } = cjsModule.exports;

test("getApiErrorMessage preserves backend message objects", () => {
  assert.equal(
    getApiErrorMessage({ message: "Email hoặc mật khẩu không đúng" }, "Fallback"),
    "Email hoặc mật khẩu không đúng",
  );
});

test("getApiErrorMessage preserves Error messages", () => {
  assert.equal(
    getApiErrorMessage(new Error("Phiên đăng nhập hết hạn"), "Fallback"),
    "Phiên đăng nhập hết hạn",
  );
});

test("getApiErrorMessage falls back for unknown error shapes", () => {
  assert.equal(getApiErrorMessage({ detail: "ignored" }, "Thao tác thất bại"), "Thao tác thất bại");
});
