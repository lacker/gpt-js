import fs from "fs";
import readline from "readline";
import { ZSTDDecompress } from "simple-zstd";
import tar from "tar-stream";
import { parse } from "@typescript-eslint/typescript-estree";

let counter = new Map();
let written = 0;
let skipped = 0;

let extract = tar.extract();
extract.on("entry", (header, stream, next) => {
  console.log("header:", header);

  let rl = readline.createInterface({
    input: stream.pipe(ZSTDDecompress()),
    terminal: false
  });

  rl.on("line", line => {
    let data = JSON.parse(line);
    let ast;
    try {
      ast = parse(data.text);
    } catch (e) {
      console.log(e);
      skipped++;
      return;
    }

    written++;
    fs.writeFileSync(`/d/ts/${written}.ts`, data.text);
    if (written % 100 == 0) {
      console.log(`${written} code files written. ${skipped} files skipped`);
    }
  });

  rl.on("close", next);
});

extract.on("finish", () => {
  console.log("finished");
});

fs.createReadStream("/d/pile/github.tar").pipe(extract);
