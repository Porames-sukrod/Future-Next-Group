import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const header = readFileSync(join(process.cwd(), "header.html"), "utf8");
const css = readFileSync(join(process.cwd(), "css", "header.css"), "utf8");

assert.ok(
    !header.includes("header-water-wave") &&
    !header.includes("header-water-shimmer") &&
    !header.includes("blue-wave"),
    "header should not render decorative water-wave elements behind the navbar"
);

assert.ok(
    !/@keyframes\s+headerWaterWaveDrift/.test(css) &&
    !/@keyframes\s+headerWaterShimmer/.test(css),
    "header theme should not include water-wave animation keyframes"
);

assert.ok(
    /\.header\.header-sticky,\s*\.header\.header-sticky\.is-scrolled\s*\{[\s\S]*?linear-gradient\(100deg,\s*#17416D\s*0%,\s*#4185CF\s*52%,\s*#0299D4\s*100%\)/.test(css),
    "header background should use the requested three-color blue gradient"
);

assert.ok(
    !/\.header-water-wave/.test(css) &&
    !/\.blue-wave/.test(css),
    "header CSS should not keep unused water-wave selectors"
);
