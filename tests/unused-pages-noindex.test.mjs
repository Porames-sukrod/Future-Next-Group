import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const unusedPages = [
    "blog-list.html",
    "blog-list-en.html",
    "blog-standard.html",
    "blog-standard-en.html",
    "blog-details.html",
    "blog-details-en.html",
    "faq.html",
    "faq-en.html",
    "pricing.html",
    "pricing-en.html",
    "team.html",
    "team-en.html",
    "porfolio-grid.html",
    "porfolio-grid-en.html",
    "porfolio-details.html",
    "porfolio-details-en.html",
    "porfolio-water-pump.html",
    "porfolio-water-pump-en.html",
    join("icons", "icomoon", "demo.html")
];

const activePages = [
    "index.html",
    "index-en.html",
    "about-us.html",
    "about-us-en.html",
    "services.html",
    "services-en.html",
    "services-details.html",
    "services-details-en.html",
    "contact.html",
    "contact-en.html",
    "porfolio-list.html",
    "porfolio-list-en.html",
    "porfolio-assembly.html",
    "porfolio-assembly-en.html",
    "porfolio-electronics.html",
    "porfolio-electronics-en.html",
    "porfolio-it-equipment.html",
    "porfolio-it-equipment-en.html",
    "porfolio-security.html",
    "porfolio-security-en.html",
    "porfolio-solar.html",
    "porfolio-solar-en.html",
    "porfolio-spare-parts.html",
    "porfolio-spare-parts-en.html"
];

const robotsNoindex = /<meta\s+name=["']robots["']\s+content=["']noindex,\s*nofollow["']\s*\/?>/i;

unusedPages.forEach((page) => {
    const html = readFileSync(join(process.cwd(), page), "utf8");
    assert.ok(robotsNoindex.test(html), `${page} should be marked noindex, nofollow`);
});

activePages.forEach((page) => {
    const html = readFileSync(join(process.cwd(), page), "utf8");
    assert.ok(!robotsNoindex.test(html), `${page} should remain indexable`);
});
