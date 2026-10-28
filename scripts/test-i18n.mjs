import { build } from "esbuild";
import { spawnSync } from "node:child_process";

await build({
  entryPoints: ["tests/i18n.test.tsx"],
  outfile: ".prerender/i18n.test.mjs",
  bundle: true,
  platform: "node",
  packages: "external",
  format: "esm",
  loader: { ".css": "empty" },
  define: { "process.env.NODE_ENV": '"production"' },
});
const result = spawnSync(
  process.execPath,
  ["--test", ".prerender/i18n.test.mjs"],
  { stdio: "inherit" },
);
process.exitCode = result.status ?? 1;
