import fs from "fs";
import readline from "readline";
import { ZSTDDecompress } from "simple-zstd";
import tar from "tar-stream";

let extract = tar.extract();
extract.on("entry", (header, stream, next) => {
  console.log("header:", header);

  let rl = readline.createInterface({
    input: stream.pipe(ZSTDDecompress()),
    terminal: false
  });

  rl.on("line", line => {
    console.log("line:", line);

    // For now just grab one line
    process.exit(0);
  });

  rl.on("close", next);
});

extract.on("finish", () => {
  console.log("finished");
});

fs.createReadStream("/d/pile/github.tar").pipe(extract);
