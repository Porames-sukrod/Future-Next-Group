import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const thai = readFileSync(join(root, "index.html"), "utf8");
const english = readFileSync(join(root, "index-en.html"), "utf8");

const textBetween = (html, pattern, label) => {
    const match = html.match(pattern);
    assert.ok(match, `missing ${label}`);
    return match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
};

const listItemsInSection = (html, heading) => {
    const sectionStart = html.indexOf(heading);
    assert.notEqual(sectionStart, -1, `missing section heading: ${heading}`);

    const nextSectionStart = html.indexOf("<section", sectionStart + heading.length);
    const sectionHtml = html.slice(sectionStart, nextSectionStart === -1 ? undefined : nextSectionStart);

    return [...sectionHtml.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)]
        .map((match) => match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
};

assert.equal(
    textBetween(english, /<h1>([\s\S]*?)<\/h1>/, "English home heading"),
    "Home",
    "English home page h1 should be the translated equivalent of หน้าแรก"
);

assert.ok(
    english.includes("<h2>Company Introduction</h2>"),
    "English index should keep the Company Introduction section aligned with Thai"
);

const thaiOfferings = listItemsInSection(thai, "<h2>ผลิตภัณฑ์และบริการหลัก</h2>");
const englishOfferings = listItemsInSection(english, "<h2>Key Offerings</h2>");

assert.equal(
    englishOfferings.length,
    thaiOfferings.length,
    "English Key Offerings should have the same number of list items as Thai"
);

assert.ok(
    englishOfferings.some((item) => item.includes("After-sales Services") && item.includes("Maintenance")),
    "English Key Offerings should include after-sales and maintenance in the combined final offering"
);

assert.doesNotMatch(
    english,
    /Ø/,
    "English index should not contain mojibake or stray replacement characters"
);
