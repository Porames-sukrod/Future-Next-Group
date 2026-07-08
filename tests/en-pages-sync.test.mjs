import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const changedToday = new Date("2026-06-21T00:00:00+07:00").getTime();

const htmlFiles = readdirSync(root)
    .filter((file) => file.endsWith(".html") && !file.endsWith("-en.html"))
    .filter((file) => file !== "header.html" && file !== "footer-cards.html")
    .filter((file) => statSync(join(root, file)).mtime.getTime() >= changedToday)
    .filter((file) => {
        const enFile = file.replace(/\.html$/, "-en.html");
        try {
            statSync(join(root, enFile));
            return true;
        } catch {
            return false;
        }
    });

assert.ok(htmlFiles.length > 0, "expected Thai pages changed today with English counterparts");

const count = (html, pattern) => (html.match(pattern) ?? []).length;
const imageSources = (html) => [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g)]
    .map((match) => match[1].replaceAll("\\", "/"));
const bodyScripts = (html) => [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g)]
    .map((match) => match[1])
    .filter((src) => !["js/header-include.js", "js/bootstrap.min.js"].includes(src));

for (const thaiFile of htmlFiles) {
    const enFile = thaiFile.replace(/\.html$/, "-en.html");
    const thai = readFileSync(join(root, thaiFile), "utf8");
    const english = readFileSync(join(root, enFile), "utf8");

    assert.equal(
        count(english, /<section\b/g),
        count(thai, /<section\b/g),
        `${enFile} should have the same section count as ${thaiFile}`
    );

    assert.deepEqual(
        bodyScripts(english).sort(),
        bodyScripts(thai).sort(),
        `${enFile} should load the same page-specific scripts as ${thaiFile}`
    );

    assert.deepEqual(
        imageSources(english),
        imageSources(thai),
        `${enFile} should use the same images, in the same order, as ${thaiFile}`
    );

    assert.match(english, /<html lang="en">/, `${enFile} should remain the English page`);
    assert.ok(
        english.includes("window.FOOTER_CARDS_FILE = 'footer-cards-en.html';"),
        `${enFile} should load the English footer cards`
    );
}
