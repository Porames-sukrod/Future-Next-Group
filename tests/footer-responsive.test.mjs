import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(process.cwd(), "css", "footer-cards.css"), "utf8");

assert.ok(
    /@media\s*\(min-width:\s*768px\)\s*and\s*\(max-width:\s*991px\)\s*\{[\s\S]*?\.footer-middle\s*\{[\s\S]*?grid-template-columns:\s*1\.4fr\s*1fr\s*1\.1fr\s*!important;/.test(css),
    "iPad mini and iPad Air footer should use the same three-column layout as iPad Pro"
);

assert.ok(
    /@media\s*\(min-width:\s*768px\)\s*and\s*\(max-width:\s*991px\)[\s\S]*?\.footer-brand\s*\{[\s\S]*?grid-column:\s*auto\s*!important;/.test(css),
    "iPad mini and iPad Air footer brand block should not span the full row"
);

assert.ok(
    /@media\s*\(max-width:\s*767px\)\s*\{[\s\S]*?\.footer,\s*\.footer-inner\s*\{[\s\S]*?padding:\s*56px\s*0\s*0\s*!important;/.test(css),
    "mobile footer should reduce vertical padding"
);

assert.ok(
    /@media\s*\(max-width:\s*767px\)[\s\S]*?\.footer-middle\s*\{[\s\S]*?grid-template-columns:\s*1fr\s*!important;/.test(css),
    "mobile footer should use a single-column layout"
);

assert.ok(
    /@media\s*\(max-width:\s*767px\)[\s\S]*?\.footer-map-btn\s*\{[\s\S]*?width:\s*100%\s*!important;/.test(css),
    "mobile footer map button should fill the column without overflowing"
);

assert.ok(
    !/\.footer-nav\s+a::after\s*\{[\s\S]*?content:\s*["']↗["'];/.test(css),
    "footer navigation links should not show arrow affordance"
);

assert.ok(
    /\.footer-nav\s+a:hover,\s*\.footer-nav\s+a:focus-visible\s*\{[\s\S]*?text-decoration:\s*underline;/.test(css),
    "footer navigation links should still use underline on hover and focus"
);

assert.ok(
    /\.footer\s+a:focus-visible,\s*\.footer-inner\s+a:focus-visible\s*\{[\s\S]*?outline:\s*2px\s*solid\s*#d4b765/.test(css),
    "footer links should have a visible keyboard focus style"
);

assert.ok(
    /@media\s*\(max-width:\s*767px\)[\s\S]*?\.footer-nav\s+a:active,\s*\.footer-contact\s+a:active,\s*\.footer-map-btn:active\s*\{[\s\S]*?background:\s*rgba\(212,\s*183,\s*101,\s*\.16\)/.test(css),
    "mobile footer links should provide tap feedback"
);
