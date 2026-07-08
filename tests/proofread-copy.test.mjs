import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const read = (file) => readFileSync(join(process.cwd(), file), "utf8");

const indexTh = read("index.html");
const indexEn = read("index-en.html");
const aboutTh = read("about-us.html");

assert.doesNotMatch(
    indexTh,
    /Automatic Barrie(?!rs)/,
    "Thai home page should spell Automatic Barriers correctly"
);

assert.ok(
    indexEn.includes("Our clients' success is our success."),
    "English home page should use the possessive clients' success"
);

assert.ok(
    aboutTh.includes("<h2>แนะนำบริษัท</h2>"),
    "Thai about page should use a Thai heading for the company introduction section"
);
