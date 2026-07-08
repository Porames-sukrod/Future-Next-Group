import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const firstPartyCssFiles = [
    "css/styles.css",
    "css/header.css",
    "css/header-premium.css",
    "css/fng-content.css",
    "css/footer-cards.css"
];

const contentFont = /font-family:\s*"Sarabun",\s*Arial,\s*sans-serif/i;

firstPartyCssFiles.forEach((file) => {
    const css = readFileSync(join(process.cwd(), file), "utf8");
    assert.ok(
        !/font-family:\s*"Franklin Gothic"/i.test(css),
        `${file} should not use Franklin Gothic for site text`
    );
    assert.ok(
        !/font-family:\s*"Inter"/i.test(css),
        `${file} should not use Inter for site text`
    );
});

["css/styles.css", "css/header.css", "css/fng-content.css"].forEach((file) => {
    const css = readFileSync(join(process.cwd(), file), "utf8");
    assert.ok(contentFont.test(css), `${file} should use Sarabun as the primary content font`);
});

const stylesCss = readFileSync(join(process.cwd(), "css/styles.css"), "utf8");

assert.ok(
    /font-family:\s*"icomoon"/i.test(stylesCss),
    "icon font declarations should remain available for icon glyphs"
);
