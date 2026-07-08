import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const html = readFileSync(join(process.cwd(), "services.html"), "utf8");
const englishHtml = readFileSync(join(process.cwd(), "services-en.html"), "utf8");
const css = readFileSync(join(process.cwd(), "css", "fng-content.css"), "utf8");
const accordionJs = readFileSync(join(process.cwd(), "js", "service-accordion.js"), "utf8");

const readinessIndex = html.indexOf("<h2>ความพร้อมของเรา</h2>");
const solutionsIndex = html.indexOf("fng-service-accordion");

assert.notEqual(readinessIndex, -1, "services page should keep the readiness section");
assert.notEqual(solutionsIndex, -1, "services page should include the new service accordion");
assert.ok(
    solutionsIndex > readinessIndex,
    "service accordion should appear after the readiness section"
);

const expectedServices = [
    {
        title: "ระบบ CCTV อัจฉริยะ",
        image: "image/solutions/solution-cctv-security.png",
        body: "ดูภาพออนไลน์ได้ทุกที่ ทุกเวลา"
    },
    {
        title: "ระบบ Solar Cell พลังงานสะอาด",
        image: "image/solutions/solution-solar-cell.png",
        body: "ลดค่าไฟฟ้าในระยะยาว"
    },
    {
        title: "ระบบพลังงานทดแทนสำหรับบ้าน",
        image: "image/solutions/solution-monitoring.png",
        body: "ใช้พลังงานแสงอาทิตย์ทดแทนไฟบ้าน"
    },
    {
        title: "บริการติดตั้งและดูแลครบวงจร",
        image: "image/solutions/solution-installation.png",
        body: "บริการครบจบในที่เดียว"
    }
];

for (const service of expectedServices) {
    assert.ok(html.includes(service.title), `missing service title: ${service.title}`);
    assert.ok(html.includes(service.image), `missing service image: ${service.image}`);
    assert.ok(html.includes(service.body), `missing service detail: ${service.body}`);
}

assert.equal(
    (html.match(/class="fng-service-accordion-item"/g) ?? []).length,
    expectedServices.length,
    "accordion should render four service items"
);

assert.equal(
    (englishHtml.match(/class="fng-service-accordion-item"/g) ?? []).length,
    expectedServices.length,
    "English accordion should render the same four service items"
);

assert.doesNotMatch(
    html,
    /<p class="fng-service-eyebrow">/,
    "Thai services page should not keep commented accordion copy that desynchronizes text extraction"
);

assert.ok(
    html.includes("aria-expanded=\"false\""),
    "accordion buttons should expose collapsed state for accessibility"
);

assert.ok(
    css.includes("max-height 0.32s ease"),
    "accordion panel should animate open and closed with max-height"
);

assert.ok(
    accordionJs.includes("panel.scrollHeight"),
    "accordion click handler should use the panel content height for slide-down animation"
);

assert.ok(
    accordionJs.includes("panel.style.maxHeight"),
    "accordion click handler should update max-height when toggling panels"
);
