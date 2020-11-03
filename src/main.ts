import fs from "fs";
import readline from "readline";
import { ZSTDDecompress } from "simple-zstd";
import tar from "tar-stream";

let counter = new Map();
let files = 0;

let extract = tar.extract();
extract.on("entry", (header, stream, next) => {
  console.log("header:", header);

  let rl = readline.createInterface({
    input: stream.pipe(ZSTDDecompress()),
    terminal: false
  });

  rl.on("line", line => {
    let data = JSON.parse(line);
    let language = data.repo_language;
    if (counter.has(language)) {
      counter.set(language, counter.get(language) + 1);
    } else {
      counter.set(language, 1);
    }
    files++;
    if (files % 1000 == 0) {
      console.log(`data: ${JSON.stringify(data, null, 2)}`);

      let entries: any = counter.entries();
      entries.sort((a, b) => b[1] - a[1]);
      console.log(`at ${files} files:`);
      for (let [lang, count] of entries) {
        console.log(`  ${count} : ${lang}`);
      }
    }
  });

  rl.on("close", next);
});

extract.on("finish", () => {
  console.log("finished");
});

fs.createReadStream("/d/pile/github.tar").pipe(extract);
