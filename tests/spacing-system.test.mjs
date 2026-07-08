import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const styles = readFileSync(resolve('css/styles.css'), 'utf8');
const fng = readFileSync(resolve('css/fng-content.css'), 'utf8');

assert.match(
    styles,
    /Balanced page spacing/,
    'Template pages should define a central balanced spacing override.'
);

assert.match(
    styles,
    /--template-section-space-y:\s*clamp\(48px,\s*4\.5vw,\s*68px\);/,
    'Template section spacing should stay compact on desktop.'
);

assert.match(
    styles,
    /\.tf-spacing-1,\s*\.tf-spacing-2,\s*\.tf-spacing-3,\s*\.tf-spacing-4,\s*\.tf-spacing-5,\s*\.tf-spacing-6,\s*\.tf-spacing-7,\s*\.tf-spacing-8,\s*\.tf-spacing-9,\s*\.tf-spacing-10,\s*\.tf-spacing-11,\s*\.tf-spacing-12\s*\{[\s\S]*?padding-top:\s*var\(--template-section-space-y\);[\s\S]*?padding-bottom:\s*var\(--template-section-space-y\);[\s\S]*?margin-top:\s*0;[\s\S]*?margin-bottom:\s*0;/,
    'Template spacing utilities should use equal top and bottom rhythm instead of uneven margins.'
);

assert.match(
    styles,
    /\.page-title \.page-title-content,\s*\.page-title\.p-pricing \.page-title-content\s*\{[\s\S]*?padding-top:\s*var\(--template-page-title-space-y\);[\s\S]*?padding-bottom:\s*var\(--template-page-title-space-y\);/,
    'Template page titles should have equal top and bottom spacing.'
);

assert.match(
    fng,
    /Balanced FNG page spacing/,
    'FNG pages should define a central balanced spacing override.'
);

assert.match(
    fng,
    /--fng-section-space-y:\s*clamp\(42px,\s*4\.2vw,\s*60px\);/,
    'FNG section spacing should stay compact and not overly wide.'
);

assert.match(
    fng,
    /\.fng-section,\s*\.fng-visual,\s*\.fng-solutions-showcase,\s*\.fng-service-accordion,\s*\.fng-map-section\s*\{[\s\S]*?padding-top:\s*var\(--fng-section-space-y\);[\s\S]*?padding-bottom:\s*var\(--fng-section-space-y\);/,
    'FNG section-level blocks should share equal top and bottom spacing.'
);

console.log('Balanced section spacing rules are present.');
