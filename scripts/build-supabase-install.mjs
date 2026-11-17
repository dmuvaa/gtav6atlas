#!/usr/bin/env node
/**
 * Regenerates supabase/install.sql (idempotent) and install-continue.sql (002+003).
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const mig = (n) =>
  readFileSync(path.join(root, "supabase/migrations", n), "utf8");

const header = (title, note) => `-- ${title}
-- ${note}

`;

function idempotentEnums(sql) {
  return sql.replace(
    /create type (\w+) as enum \(([\s\S]*?)\);/gi,
    (_, name, body) => {
      const labels = body
        .replace(/\s+/g, " ")
        .trim()
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .join(", ");
      return `do $enum$ begin
  create type ${name} as enum (${labels});
exception when duplicate_object then null;
end $enum$;`;
    },
  );
}

function idempotentTables(sql) {
  return sql.replace(
    /^create table (?!if not exists )(\w+)/gim,
    "create table if not exists $1",
  );
}

function idempotentIndexes(sql) {
  return sql.replace(/^create index (\w+)/gim, "create index if not exists $1");
}

function idempotentPolicies(sql) {
  return sql.replace(
    /^create policy "([^"]+)"\s+on (\w+)/gim,
    (match, policyName, tableName) =>
      `drop policy if exists "${policyName}" on ${tableName};\ncreate policy "${policyName}"\n  on ${tableName}`,
  );
}

function transformBlock(sql) {
  let out = sql;
  out = idempotentEnums(out);
  out = idempotentTables(out);
  out = idempotentIndexes(out);
  out = idempotentPolicies(out);
  return out;
}

const m001 = transformBlock(mig("001_initial_schema.sql"));
const m002 = transformBlock(mig("002_auth_profiles.sql"));
const m003 = transformBlock(mig("003_staff_rls.sql"));

const install = `${header(
  "GTA6AtlasHQ — full install (fresh project only)",
  "If you see verification_status already exists: do NOT use this file. Run roles-minimal.sql or install-continue.sql instead.",
)}${m001}\n${m002}\n${m003}\n`;

const installContinue = `${header(
  "GTA6AtlasHQ — after 001 (NO enums in this file)",
  "Run this when 001 is done. If you only need Table Editor roles, roles-minimal.sql is enough.",
)}
-- This file intentionally has no CREATE TYPE statements.

${m002}\n${m003}\n`;

writeFileSync(path.join(root, "supabase/install.sql"), install);
writeFileSync(path.join(root, "supabase/install-continue.sql"), installContinue);
console.log("Wrote supabase/install.sql and supabase/install-continue.sql");