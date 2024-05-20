import { Readable } from "node:stream";
import fs from "fs";
import { parse } from "csv-parse";
import fetch from "node-fetch";

async function createTask(title, description) {
  return await fetch("http://localhost:3333/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  });
}

(async () => {
  const parser = fs.createReadStream("file.csv").pipe(parse());

  let index = 0;

  process.stdout.write("start\n");

  for await (const record of parser) {
    // Pular a primeira linha do CSV
    if (index === 0) {
      index++;
      continue;
    }

    process.stdout.write(`${index++} ${record.join(",")}\n`);

    const [title, description] = record;

    await createTask(title, description)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }

  process.stdout.write("...done\n");
})();
