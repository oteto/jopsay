import { Delimiters } from "./balloon.ts";
import {
  Command,
  Input,
  join,
  List,
  promptList,
  stringWidth,
} from "../deps.ts";

const XDG_CONFIG_HOME = Deno.env.get("XDG_CONFIG_HOME") ||
  join(Deno.env.get("HOME") ?? "", ".config");

const JOPSAY_CONFIG_DIR = join(XDG_CONFIG_HOME, "jopsay");
const JOPSAY_CONFIG_PATH = join(JOPSAY_CONFIG_DIR, "jopsay.json");

type Config = Delimiters & { thought: string };

export async function loadConfig(): Promise<Config> {
  const config: Config = JSON.parse(
    await Deno.readTextFile(JOPSAY_CONFIG_PATH),
  );
  if (stringWidth(config.thought) !== 1) {
    throw new Error(
      "A string that cannot be used for thought is specified. Please use a character with a width of 1 character.",
    );
  }
  return config;
}

export const configureCommand = new Command().description(
  "configure jopsay custom delimiter strings.",
).action(async () => {
  await configure();
  Deno.exit(0);
});

async function configure() {
  const result = await promptList([
    {
      name: "first",
      message: "input delimiter first [left, right]",
      type: List,
      after: async ({ first }, next) => {
        if (
          first === undefined || first.length !== 2 ||
          first.some((f) => stringWidth(f) !== 1)
        ) {
          console.error("💥 error");
          await next("first");
          return;
        }
        await next();
      },
    },
    {
      name: "middle",
      message: "input delimiter middle [left, right]",
      type: List,
      after: async ({ middle }, next) => {
        if (
          middle === undefined || middle.length !== 2 ||
          middle.some((f) => stringWidth(f) !== 1)
        ) {
          console.error("💥 error");
          await next("middle");
          return;
        }
        await next();
      },
    },
    {
      name: "last",
      message: "input delimiter last [left, right]",
      type: List,
      after: async ({ last }, next) => {
        if (
          last === undefined || last.length !== 2 ||
          last.some((f) => stringWidth(f) !== 1)
        ) {
          console.error("💥 error");
          await next("last");
          return;
        }
        await next();
      },
    },
    {
      name: "only",
      message: "input delimiter only [left, right]",
      type: List,
      after: async ({ only }, next) => {
        if (
          only === undefined || only.length !== 2 ||
          only.some((f) => stringWidth(f) !== 1)
        ) {
          console.error("💥 error");
          await next("only");
          return;
        }
        await next();
      },
    },
    {
      name: "vertical",
      message: "input delimiter vertical [top, bottom]",
      type: List,
      after: async ({ vertical }, next) => {
        if (
          vertical === undefined || vertical.length !== 2 ||
          vertical.some((f) => stringWidth(f) !== 1)
        ) {
          console.error("💥 error");
          await next("vertical");
          return;
        }
        await next();
      },
    },
    {
      name: "thought",
      message: "input delimiter thought",
      type: Input,
      after: async ({ thought }, next) => {
        if (
          thought === undefined || stringWidth(thought) !== 1
        ) {
          console.error("💥 error");
          await next("thought");
          return;
        }
        await next();
      },
    },
  ]);

  await Deno.writeTextFile(JOPSAY_CONFIG_PATH, JSON.stringify(result, null, 2));

  console.log("🎉 Configuration is complete.");
  console.log(
    "Try typing the following command to check it out: 'echo Hello, jopsay! | jopsay -f config'",
  );
}
