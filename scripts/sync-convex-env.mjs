import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const envPath = new URL("../.env", import.meta.url);
const envText = readFileSync(envPath, "utf8");

const keys = [
  "OPENROUTER_API_KEY",
  "OPENROUTER_BASE_URL",
  "EXTRACTION_MODEL",
  "RESPONSE_MODEL",
  "JWT_PRIVATE_KEY",
  "JWKS",
];

function parseDotenv(text) {
  const result = {};
  const lines = text.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line || line.startsWith("#")) {
      i++;
      continue;
    }
    const eq = line.indexOf("=");
    if (eq < 0) {
      i++;
      continue;
    }
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (value.startsWith('"')) {
      let body = value.slice(1);
      while (i < lines.length) {
        const last = body.indexOf('"');
        if (last >= 0 && !body.slice(0, last).endsWith("\\")) {
          body = body.slice(0, last);
          break;
        }
        i++;
        if (i < lines.length) body += "\n" + lines[i];
      }
      value = body;
    }
    result[key] = value;
    i++;
  }
  return result;
}

const parsed = parseDotenv(envText);
const values = {};

for (const key of keys) {
  if (!(key in parsed)) {
    console.warn(`Skipping ${key}: not found in .env`);
    continue;
  }
  const value = parsed[key];
  if (!value) {
    console.warn(`Skipping ${key}: empty value`);
    continue;
  }
  values[key] = value;
}

if (Object.keys(values).length === 0) {
  console.warn("No environment variables to sync.");
  process.exit(0);
}

const convexBin = fileURLToPath(
  new URL("../node_modules/convex/bin/main.js", import.meta.url),
);

const tempDir = mkdtempSync(join(tmpdir(), "convex-env-"));
let failed = false;
try {
  for (const [key, value] of Object.entries(values)) {
    const valueFile = join(tempDir, `${key}.txt`);
    writeFileSync(valueFile, value, "utf8");
    console.log(`Setting ${key} on Convex deployment...`);
    const result = spawnSync(
      process.execPath,
      [convexBin, "env", "set", "--force", key, "--from-file", valueFile],
      { stdio: "inherit" },
    );
    if (result.status !== 0) {
      failed = true;
      break;
    }
  }
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

if (failed) {
  process.exit(1);
}

console.log("Convex environment variables synced from .env");