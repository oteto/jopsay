import { jopsColorAA } from "~/lib/asciiArt.ts";
import { say, think } from "~/lib/balloon.ts";
import { Command, readLines } from "~/deps.ts";

const VERSION = "0.1.0";

async function main() {
  const stdin = [];
  const isatty = Deno.isatty(Deno.stdin.rid);
  if (!isatty) {
    for await (const line of readLines(Deno.stdin)) {
      stdin.push(line);
    }
  }

  const { args, options } = await new Command()
    .name("jopsay")
    .version(VERSION)
    .description("")
    .option("-t, --think", "")
    .arguments("<text:string>")
    .parse(isatty ? Deno.args : [...Deno.args, stdin.join("\n")]);

  const format = options.think ? think : say;
  console.log(format(args[0]) + jopsColorAA);
}

if (import.meta.main) {
  await main();
}
