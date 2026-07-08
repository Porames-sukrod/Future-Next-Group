import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const pages = [
    "porfolio-assembly",
    "porfolio-electronics",
    "porfolio-it-equipment",
    "porfolio-security",
    "porfolio-solar",
    "porfolio-spare-parts"
];

const thaiHeading = "บริการที่เชื่อมต่อกัน";
const thaiBody = "หมวดผลิตภัณฑ์นี้สามารถเชื่อมต่อกับการจัดหา โลจิสติกส์ การติดตั้ง การออกแบบระบบ การบำรุงรักษา และบริการหลังการขาย";
const englishHeading = "Connected Service";
const englishBody = "This product category can connect with sourcing, logistics, installation, system design, maintenance, and after-sales support.";
const visibleText = (html) => html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

for (const page of pages) {
    const thai = readFileSync(join(process.cwd(), `${page}.html`), "utf8");
    const english = readFileSync(join(process.cwd(), `${page}-en.html`), "utf8");
    const thaiText = visibleText(thai);
    const englishText = visibleText(english);

    assert.ok(thai.includes(`<h2>${thaiHeading}</h2>`), `${page}.html should use the Thai Connected Service heading`);
    assert.ok(thaiText.includes(thaiBody), `${page}.html should use the Thai Connected Service body`);
    assert.ok(!thai.includes("<h2>สรุปโครงการ</h2>"), `${page}.html should not keep the old project-summary heading`);

    assert.ok(english.includes(`<h2>${englishHeading}</h2>`), `${page}-en.html should keep the English Connected Service heading`);
    assert.ok(englishText.includes(englishBody), `${page}-en.html should keep the English Connected Service body`);
}
