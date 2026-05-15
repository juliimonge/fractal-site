#!/usr/bin/env node
// Merge the Brand patch into Dawn's settings_schema.json.
//
// settings_schema.json is an array of groups. We:
//   1. Read the existing array.
//   2. Drop any pre-existing group named "Brand" (idempotent).
//   3. Insert the Brand group right after the theme_info entry.
//
// Usage:
//   node merge-settings-schema.mjs <target.json> <patch.json>

import { readFileSync, writeFileSync } from 'node:fs';

const [, , targetPath, patchPath] = process.argv;
if (!targetPath || !patchPath) {
  console.error('usage: merge-settings-schema.mjs <target.json> <patch.json>');
  process.exit(1);
}

const target = JSON.parse(readFileSync(targetPath, 'utf8'));
const patch = JSON.parse(readFileSync(patchPath, 'utf8'));

if (!Array.isArray(target)) {
  throw new Error(`Expected settings_schema.json to be an array, got ${typeof target}`);
}
if (!Array.isArray(patch)) {
  throw new Error(`Expected patch to be an array, got ${typeof patch}`);
}

const filtered = target.filter((g) => g?.name !== 'Brand');
const themeInfoIdx = filtered.findIndex((g) => g?.name === 'theme_info' || g?.theme_name);
const insertAt = themeInfoIdx >= 0 ? themeInfoIdx + 1 : 0;

const merged = [
  ...filtered.slice(0, insertAt),
  ...patch,
  ...filtered.slice(insertAt),
];

writeFileSync(targetPath, JSON.stringify(merged, null, 2) + '\n');
console.log(`merged ${patch.length} group(s) into ${targetPath}`);
