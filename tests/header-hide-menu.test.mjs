import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const headerIncludeJs = readFileSync(join(process.cwd(), "js", "header-include.js"), "utf8");

const expandTopNavMatch = headerIncludeJs.match(/function expandTopNav\(\) \{[\s\S]*?\n    \}/);

assert.ok(expandTopNavMatch, "header include should define expandTopNav");

const expandTopNav = expandTopNavMatch[0];
const layoutToggleMatch = headerIncludeJs.match(/function initLayoutToggle\(\) \{[\s\S]*?\n\}/);

assert.ok(
    !expandTopNav.includes("scrollHeight"),
    "expandTopNav should not use scrollHeight because it can overshoot the rendered navbar height"
);

assert.ok(
    expandTopNav.includes("getBoundingClientRect().height"),
    "expandTopNav should animate to the rendered CSS height"
);

assert.ok(
    /hdr\.style\.height\s*=\s*'';[\s\S]*?getBoundingClientRect\(\)\.height/.test(expandTopNav),
    "expandTopNav should clear inline height before measuring the rendered CSS height"
);

assert.ok(layoutToggleMatch, "header include should define initLayoutToggle");

assert.ok(
    !/mode === 'sidebar'[\s\S]*?localStorage\.setItem\('navHidden', '1'\)/.test(layoutToggleMatch[0]),
    "switching to sidebar should not persist the menu as hidden"
);

assert.ok(
    !/mode === 'sidebar'[\s\S]*?document\.body\.classList\.add\('nav-hidden'\)/.test(layoutToggleMatch[0]),
    "switching to sidebar should not collapse the menu"
);
