import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const read = (file) => readFileSync(join(process.cwd(), file), "utf8");
const normalize = (html) => html
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const aboutEn = normalize(read("about-us-en.html"));
const contactTh = normalize(read("contact.html"));
const footerEn = normalize(read("footer-cards-en.html"));
const waterPumpTh = normalize(read("porfolio-water-pump.html"));

assert.ok(
    aboutEn.includes("supported by a skilled professional team and strong market alliances"),
    "English about page should include the professional team and alliance detail from Thai"
);

assert.ok(
    aboutEn.includes("Act as a strategic partner and business tool to help clients achieve their goals effectively and sustainably"),
    "English about strategic role should include sustainable outcomes"
);

assert.ok(
    aboutEn.includes("air conditioning"),
    "English about team list should include air-conditioning installation from Thai"
);

assert.ok(
    aboutEn.includes("future projects"),
    "English clean-energy partnership copy should use plural future projects"
);

assert.doesNotMatch(
    contactTh,
    /เหมาะกับ ธุรกิจ/,
    "Thai contact page should not have an extra space in เหมาะกับธุรกิจ"
);

assert.ok(
    footerEn.includes("Electronics & Electrical Appliances"),
    "English footer cards should use the full electronics product category name"
);

assert.ok(
    footerEn.includes("Spare Parts & Accessories"),
    "English footer cards should use the full spare-parts product category name"
);

assert.ok(
    footerEn.includes("Assembly & Integration Products"),
    "English footer cards should use the full assembly product category name"
);

assert.ok(
    waterPumpTh.includes("นโยบายความเป็นส่วนตัว"),
    "Thai water pump page should localize the privacy-policy footer label"
);

assert.ok(
    waterPumpTh.includes("ติดต่อ"),
    "Thai water pump page should localize the contact footer label"
);
