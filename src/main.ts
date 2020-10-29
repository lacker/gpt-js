import fs from "fs";
import tar from "tar-stream";

let extract = tar.extract();
extract.on("entry", (header, stream, next) => {
  console.log("header:", header);

  //
  stream.on("end", next);
  stream.resume();
});

extract.on("finish", () => {
  console.log("finished");
});

fs.createReadStream("/d/pile/github.tar").pipe(extract);
