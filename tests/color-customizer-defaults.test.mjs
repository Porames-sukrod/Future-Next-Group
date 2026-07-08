import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const headerIncludeJs = readFileSync(join(process.cwd(), "js", "header-include.js"), "utf8");

assert.ok(
    /pageBg:\s*'#eef5f8'/.test(headerIncludeJs),
    "color customizer Page Background default should be #eef5f8"
);

assert.ok(
    /var COLOR_VER = 'v6-page-bg-eef5f8'/.test(headerIncludeJs),
    "color customizer version should be bumped so old saved defaults are refreshed"
);
