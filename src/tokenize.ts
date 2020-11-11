import fs from "fs";
import { parse } from "@typescript-eslint/typescript-estree";

// See what ts files there are
let filenames = fs.readdirSync("/d/ts");
let files = [];
for (let name of filenames) {
  let s = name.split(".")[0];
  let n = parseInt(s, 10);
  files.push({ name, n });
}
files.sort((a, b) => a.n - b.n);

// Open the index
let INDEX_FILE = "/d/tokens/index.json";
// id -> token
let indexList = [];
// token -> id
let indexMap = {};
// token -> count
let count = {};
let maxFile = 0;
try {
  let raw = fs.readFileSync(INDEX_FILE, "utf8");
  let data = JSON.parse(raw);
  ({ indexList, indexMap, maxFile, count } = data);
} catch (e) {
  console.log(e);
}

// Save the index
function save() {
  let data = { indexList, indexMap, maxFile, count };
  let raw = JSON.stringify(data, null, 2);
  fs.writeFileSync(INDEX_FILE, raw);
}

for (let { name, n } of files) {
  if (n <= maxFile) {
    continue;
  }

  // TODO: process some stuff
}

save();
