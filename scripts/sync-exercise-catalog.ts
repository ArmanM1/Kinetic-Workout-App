import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const RAW_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";

async function main() {
  const response = await fetch(RAW_URL);

  if (!response.ok) {
    throw new Error(`Failed to download exercise catalog: ${response.status}`);
  }

  const json = await response.json();
  const target = path.join(
    process.cwd(),
    "src",
    "lib",
    "data",
    "exercise-catalog.raw.json",
  );

  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(json, null, 2)}\n`, "utf8");

  console.log(`Synced ${Array.isArray(json) ? json.length : 0} exercises to ${target}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
