import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const headerIncludeJs = readFileSync(join(process.cwd(), "js", "header-include.js"), "utf8");
const headerCss = readFileSync(join(process.cwd(), "css", "header.css"), "utf8");

assert.ok(
    headerIncludeJs.includes("function syncSidebarProductsFocus()"),
    "header include should track when the sidebar product menu is focused"
);

assert.ok(
    headerIncludeJs.includes("document.body.classList.toggle('sidebar-products-focus', shouldFocus)"),
    "sidebar product focus should be reflected on the body for CSS layout changes"
);

assert.ok(
    /willOpen && document\.body\.classList\.contains\('nav-sidebar'\)[\s\S]*?setFlyoutExpanded\(flyoutItem, true\)/.test(headerIncludeJs),
    "opening Products in sidebar should open the nested product list automatically"
);

assert.ok(
    /body\.nav-sidebar\.sidebar-products-focus\s+\.header\s+\.menu-primary-menu\s*>\s*\.menu-item:not\(\[data-page="porfolio-list\.html"\]\)\s*\{[\s\S]*?max-height:\s*0\s*!important;[\s\S]*?opacity:\s*0\s*!important;/.test(headerCss),
    "sidebar product focus should collapse sibling menu items"
);

assert.ok(
    /body\.nav-sidebar\.sidebar-products-focus\s+\.menu-primary-menu\s+\.menu-item\.is-dropdown-open\s*>\s*\.sub-menu-services,[\s\S]*?max-height:\s*none\s*!important;/.test(headerCss),
    "sidebar product focus should let the product list use the available height"
);
