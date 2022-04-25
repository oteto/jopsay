import { Delimiters } from "./balloon.ts";
import { join, stringWidth } from "../deps.ts";

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
