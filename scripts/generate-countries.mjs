/**
 * Regenerates `lib/countries.js`.
 *
 *   node scripts/generate-countries.mjs
 *
 * The signup form needs one row per country: the ISO code (which also names
 * the flag file in `public/assets/flags/`), the English display name and the
 * E.164 calling code. All three come from data we already have on disk —
 * `country-flag-icons` for the set of flags that actually exist,
 * `libphonenumber-js` for the calling codes and `Intl.DisplayNames` for the
 * names — so the table is generated rather than hand-kept, and the site
 * itself ships neither dependency.
 */
import fs from "node:fs";
import path from "node:path";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

const FLAG_DIR = path.join("public", "assets", "flags");
const OUT = path.join("lib", "countries.js");

const haveFlag = new Set(
  fs
    .readdirSync(FLAG_DIR)
    .filter((f) => f.endsWith(".svg"))
    .map((f) => f.replace(".svg", "").toUpperCase())
);

const names = new Intl.DisplayNames(["en"], { type: "region" });

const rows = getCountries()
  .filter((code) => haveFlag.has(code))
  .map((code) => ({
    code,
    name: names.of(code) ?? code,
    dial: `+${getCountryCallingCode(code)}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "en"));

const body = rows
  .map((r) => `  ["${r.code}", ${JSON.stringify(r.name)}, "${r.dial}"],`)
  .join("\n");

const file = `/**
 * Every country the signup form offers, with its dialling code and the flag
 * that sits beside it.
 *
 * GENERATED FILE — do not hand-edit. Run \`node scripts/generate-countries.mjs\`
 * instead; it reads the flag set out of \`public/assets/flags/\` and the codes
 * out of libphonenumber-js, both of which are build-time only.
 *
 * Stored as tuples rather than objects because the array is inlined into the
 * client bundle and ${rows.length} repeated key names is a few kB of nothing.
 */

/** @type {[code: string, name: string, dial: string][]} */
const ROWS = [
${body}
];

export const COUNTRIES = ROWS.map(([code, name, dial]) => ({
  code,
  name,
  dial,
  /** Lowercased once here so the type-ahead filter never re-does it. */
  search: \`\${name} \${dial} \${code}\`.toLowerCase(),
  flag: \`/assets/flags/\${code.toLowerCase()}.svg\`,
}));

export const COUNTRY_BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));

/** The dialling prefix a phone value starts with once a country is chosen. */
export function dialPrefix(country) {
  return country ? \`\${country.dial} \` : "";
}
`;

fs.writeFileSync(OUT, file, "utf8");
console.log(`wrote ${OUT} — ${rows.length} countries`);
