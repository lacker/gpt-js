import fs from "fs";
import { parse } from "@typescript-eslint/typescript-estree";

let filenames = fs.readdirSync("/d/ts");
let files = [];
for (let name of filenames) {
  let s = name.split(".")[0];
  let n = parseInt(s, 10);
  files.push({ name, n });
}
files.sort((a, b) => a.n - b.n);

console.log(files.slice(0, 10));
