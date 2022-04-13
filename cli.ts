import { jopsAA, jopsColorAA } from "~/lib/asciiArt.ts";
import { Balloon, say, shout, think } from "~/lib/balloon.ts";
import { Command, readLines, Type, ValidationError } from "~/deps.ts";

import type { ITypeInfo } from "~/deps.ts";

const VERSION = "0.1.0";

class BalloonType extends Type<Balloon> {
  complete(): Array<Balloon> {
    return ["say", "think", "shout"];
  }

  values(): Array<Balloon> {
    return ["say", "think", "shout"];
  }

  parse({ label, name, value }: ITypeInfo): Balloon {
    if (!this.values().some((b) => b === value)) {
      throw new ValidationError(
        `${label} "${name}" must be a valid type of balloon format, but got "${value}". Possible values are: ${
          this.values().join(", ")
        }`,
      );
    }

    return value as Balloon;
  }

  static formatter(balloonType: Balloon): [(text: string) => string, string] {
    switch (balloonType) {
      case "say":
        return [say, "\\"];
      case "think":
        return [think, "°"];
      case "shout":
        return [shout, "≷"];
    }
  }
}

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
    .description("Let JOPS say all kinds of words.")
    .type("balloon", new BalloonType())
    .option(
      "-f, --format <balloonType:balloon>",
      "Select the balloon format.",
      { default: "say" },
    )
    .option("-c, --color", "Color is added to the JOPS.")
    .arguments("<text:string>")
    .parse(isatty ? Deno.args : [...Deno.args, stdin.join("\n")]);

  const [format, l] = BalloonType.formatter(options.format as Balloon);
  const jops = options.color ? jopsColorAA(l) : jopsAA(l);

  console.log(format(args[0]) + jops);
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error(`${error}`);
    Deno.exit(1);
  }
}
