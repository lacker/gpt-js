import fs from "fs";
import readline from "readline";
import { ZSTDDecompress } from "simple-zstd";
import tar from "tar-stream";
import { parse } from "@typescript-eslint/typescript-estree";

let written = 0;
let lineNumber = 0;

// The max line number we already processed
let alreadyProcessed = 0;

let files = fs.readdirSync("/d/ts");
for (let file of files) {
  let s = file.split(".")[0];
  let n = parseInt(s, 10);
  alreadyProcessed = Math.max(alreadyProcessed, n);
}
console.log(`already processed through file {n}`);

let extract = tar.extract();
extract.on("entry", (header, stream, next) => {
  console.log("header:", header);

  let rl = readline.createInterface({
    input: stream.pipe(ZSTDDecompress()),
    terminal: false
  });

  rl.on("line", line => {
    lineNumber++;
    if (lineNumber <= alreadyProcessed) {
      return;
    }

    let data = JSON.parse(line);
    if (!data.text.includes("import") && !data.text.includes("require")) {
      // I don't care what the parser says, this isn't javascript
      return;
    }
    let ast;
    try {
      ast = parse(data.text);
    } catch (e) {
      // console.log(e);
      return;
    }

    let fileName = `/d/ts/${lineNumber}.ts`;
    fs.writeFileSync(`/d/ts/${written}.ts`, data.text);
    written++;
    if (written % 100 == 0) {
      console.log(
        `at file ${lineNumber}. ${written} files extracted this session.`
      );
    }
  });

  rl.on("close", next);
});

extract.on("finish", () => {
  console.log("finished");
});

fs.createReadStream("/d/pile/github.tar").pipe(extract);
