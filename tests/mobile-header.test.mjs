import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(process.cwd(), "css", "header.css"), "utf8");
const premiumCss = readFileSync(join(process.cwd(), "css", "header-premium.css"), "utf8");
const headerIncludeJs = readFileSync(join(process.cwd(), "js", "header-include.js"), "utf8");

function tabletMediaSegments(source) {
    const starts = [...source.matchAll(/@media\s*\(min-width:\s*768px\)\s*and\s*\(max-width:\s*1199px\)\s*\{/g)];
    return starts.map((match) => {
        const blockStart = match.index + match[0].length - 1;
        let depth = 0;
        for (let index = blockStart; index < source.length; index += 1) {
            if (source[index] === "{") depth += 1;
            if (source[index] === "}") depth -= 1;
            if (depth === 0) return source.slice(match.index, index + 1);
        }
        return source.slice(match.index);
    });
}

function mobileButtonDisplayValuesInTablet(source) {
    return tabletMediaSegments(source).flatMap((segment) => {
        return [...segment.matchAll(/\.header\s+\.mobile-button\s*\{([\s\S]*?)\}/g)]
            .map((match) => match[1].match(/display:\s*([^;!]+)\s*!important;/)?.[1]?.trim())
            .filter(Boolean);
    });
}

function topNavbarDisplayValuesInTablet(source) {
    return tabletMediaSegments(source).flatMap((segment) => {
        return [...segment.matchAll(/body:not\(\.nav-sidebar\)\s+\.header\s+\.main-menu\s*\{([\s\S]*?)\}/g)]
            .map((match) => match[1].match(/display:\s*([^;!]+)\s*!important;/)?.[1]?.trim())
            .filter(Boolean);
    });
}

assert.ok(
    /@media\s*\(max-width:\s*767px\)[\s\S]*?body:not\(\.nav-sidebar\)\s+\.header\s+\.main-menu\s*\{[\s\S]*?display:\s*none\s*!important;/.test(css),
    "mobile top navbar should hide the inline page links"
);

assert.ok(
    /@media\s*\(max-width:\s*767px\)[\s\S]*?\.header\s+\.mobile-button\s*\{[\s\S]*?display:\s*none\s*!important;/.test(css),
    "mobile header should hide the hamburger offcanvas button like iPad"
);

assert.ok(
    topNavbarDisplayValuesInTablet(css).at(-1) === "block",
    "tablet/iPad navbar should show the page links after later tablet rules are applied"
);

assert.ok(
    mobileButtonDisplayValuesInTablet(css).at(-1) === "none",
    "tablet/iPad navbar should not show the hamburger menu button"
);

assert.ok(
    /@media\s*\(max-width:\s*767px\)[\s\S]*?#menuHideBtn,\s*#layoutToggleBtn\s*\{[\s\S]*?display:\s*inline-flex\s*!important;/.test(css),
    "mobile header should keep the same Hide and Layout controls as iPad"
);

assert.ok(
    /@media\s*\(max-width:\s*767px\)[\s\S]*?body\.nav-sidebar\s+\.header\.header-sticky\s*\{[\s\S]*?width:\s*100vw\s*!important;[\s\S]*?height:\s*100vh\s*!important;/.test(css),
    "mobile sidebar should expand to the full viewport"
);

assert.ok(
    /@media\s*\(max-width:\s*767px\)[\s\S]*?body\.nav-sidebar\.nav-hidden\s+\.header\.header-sticky\s*\{[\s\S]*?transform:\s*translateX\(-100vw\)\s*!important;/.test(css),
    "hidden mobile sidebar should move the full viewport width offscreen"
);

assert.ok(
    /@media\s*\(min-width:\s*768px\)\s*and\s*\(max-width:\s*1199px\)[\s\S]*?body\.nav-sidebar\.nav-hidden\s+\.header\.header-sticky\s*\{[\s\S]*?transform:\s*translateX\(-100vw\)\s*!important;/.test(css),
    "hidden tablet/iPad sidebar should move the full viewport width offscreen"
);

assert.ok(
    /@media\s*\(max-width:\s*767px\)[\s\S]*?body\.nav-sidebar\s+\.wrapper,\s*body\.nav-sidebar\s+\.top-bar\s*\{[\s\S]*?margin-left:\s*0\s*!important;/.test(css),
    "mobile sidebar should not leave an iPad-style content offset"
);

assert.ok(
    !headerIncludeJs.includes("var isMobileMenu = window.matchMedia('(max-width: 767px)').matches"),
    "mobile layout toggle should not force sidebar mode off"
);

assert.ok(
    headerIncludeJs.includes("closeMobileSidebarAfterNavigation") &&
    headerIncludeJs.includes("document.body.classList.remove('nav-sidebar')") &&
    headerIncludeJs.includes("localStorage.setItem('navLayout', 'top')"),
    "mobile sidebar should close after selecting a navigation link"
);

assert.ok(
    headerIncludeJs.includes("function closeMobileSidebarAfterNavigation()") &&
    headerIncludeJs.includes("if (!window.matchMedia('(max-width: 1199px)').matches) return;"),
    "tablet/iPad sidebar should also close after selecting a navigation link"
);

assert.ok(
    /@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)/.test(css),
    "hover styling should be gated to devices that support real hover"
);

assert.ok(
    /#canvasMobile\.offcanvas-start\.show(?:\:not\(\.hiding\))?,\s*#canvasMobile\.offcanvas-start\.showing\s*\{[\s\S]*?transform:\s*none\s*!important;/.test(css),
    "mobile offcanvas should reset the offscreen transform when opened"
);

assert.ok(
    /@media\s*\(max-width:\s*767px\)[\s\S]*?\.lang-btn\s*\{[\s\S]*?height:\s*32px\s*!important;[\s\S]*?min-height:\s*32px\s*!important;[\s\S]*?max-height:\s*32px\s*!important;/.test(css),
    "mobile header language buttons should match the iPad sizing"
);

assert.ok(
    /#canvasMobile\s+#menu-mobile\s*>\s*li\.current-menu-item\s*>\s*a,\s*#canvasMobile\s+#menu-mobile\s*>\s*li\.current-menu-mobile-item\s*>\s*a\s*\{[\s\S]*?background:\s*rgba\(114,\s*255,\s*240,\s*0\.16\)\s*!important;[\s\S]*?color:\s*#ffffff\s*!important;/.test(premiumCss),
    "premium mobile menu should match the sidebar active item treatment"
);

assert.ok(
    /#mobileNavLang\s+\.language-switcher\s*\{[\s\S]*?width:\s*max-content\s*!important;[\s\S]*?display:\s*inline-flex\s*!important;/.test(premiumCss),
    "mobile language switcher should render as compact flag buttons, not a full-width empty bar"
);

assert.ok(
    /#mobileNavLang\s+\.lang-btn\s*\{[\s\S]*?height:\s*28px\s*!important;[\s\S]*?min-height:\s*28px\s*!important;/.test(premiumCss),
    "mobile language buttons should override the global 40px minimum height"
);

assert.ok(
    headerIncludeJs.includes("fng-mobile-nav-fix-style"),
    "header include should inject the final mobile nav fix after page styles load"
);

assert.ok(
    headerIncludeJs.includes("applyMobileNavStateFixes") && headerIncludeJs.includes("style.setProperty('background-color'"),
    "header include should apply inline mobile active states after Bootstrap opens the offcanvas"
);

assert.ok(
    headerIncludeJs.includes("rgba(114, 255, 240, 0.16)") &&
    !headerIncludeJs.includes("isCurrent ? '#30d5c8'"),
    "inline mobile active state should use the same background as sidebar items"
);

assert.ok(
    /#canvasMobile\s+\.btn-close\s*\{[\s\S]*?opacity:\s*1\s*!important;[\s\S]*?filter:\s*none\s*!important;/.test(premiumCss),
    "mobile offcanvas close button should be visible on the dark panel"
);

assert.ok(
    headerIncludeJs.includes("clearMobileNavOpenFixes") &&
    headerIncludeJs.includes("removeProperty('transform')") &&
    headerIncludeJs.includes("hide.bs.offcanvas"),
    "mobile nav should clear forced open transforms when the offcanvas starts closing"
);

assert.ok(
    headerIncludeJs.includes("closeMobileNavInstantly") &&
    headerIncludeJs.includes("stopImmediatePropagation") &&
    headerIncludeJs.includes("offcanvas-backdrop"),
    "mobile close button should bypass Bootstrap animation and close immediately"
);

assert.ok(
    headerIncludeJs.includes("syncMobileMenuFromDesktopHeader") &&
    headerIncludeJs.includes("cloneDesktopMenuItemForMobile"),
    "mobile offcanvas should be rebuilt from the shared desktop header menu"
);

assert.ok(
    /#canvasMobile\s+#menu-mobile\s*>\s*li\s*\{[\s\S]*?border-bottom:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.1\)\s*!important;/.test(css),
    "mobile offcanvas menu items should use the same divider treatment as sidebar items"
);

assert.ok(
    /#canvasMobile\s+#menu-mobile\s+\.sub-menu-mobile\s*\{[\s\S]*?max-height:\s*0\s*!important;[\s\S]*?overflow:\s*hidden\s*!important;/.test(css),
    "mobile offcanvas submenus should collapse like sidebar submenus"
);
