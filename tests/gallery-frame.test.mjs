import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve("css/fng-content.css"), "utf8");

assert.match(
    css,
    /\.fng-gallery-item\s*\{[\s\S]*?padding:\s*10px;[\s\S]*?border:\s*1px solid rgba\(8,\s*36,\s*59,\s*0\.14\);[\s\S]*?background:\s*#fff;[\s\S]*?box-shadow:\s*0 18px 42px rgba\(8,\s*36,\s*59,\s*0\.12\);/,
    "Product gallery items should render as clear framed image cards"
);

assert.match(
    css,
    /\.fng-gallery-item::before\s*\{[\s\S]*?content:\s*"";[\s\S]*?position:\s*absolute;[\s\S]*?border:\s*1px solid rgba\(48,\s*213,\s*200,\s*0\.28\);/,
    "Product gallery frames should include an inner accent line"
);

assert.match(
    css,
    /\.fng-gallery-item img\s*\{[\s\S]*?border-radius:\s*6px;[\s\S]*?object-fit:\s*cover;/,
    "Product gallery images should sit neatly inside the frame"
);
