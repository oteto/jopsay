import { stringWidth } from "../deps.ts";

type Delimiter = [string, string];

type Delimiters = {
  first: Delimiter;
  middle: Delimiter;
  last: Delimiter;
  only: Delimiter;
  vertical: Delimiter;
};

type LineWithWidth = {
  line: string;
  width: number;
};

const delimitersSay: Delimiters = {
  first: ["/", "\\"],
  middle: ["|", "|"],
  last: ["\\", "/"],
  only: ["<", ">"],
  vertical: ["_", "-"],
};

const delimitersThink: Delimiters = {
  first: ["(", ")"],
  middle: ["(", ")"],
  last: ["(", ")"],
  only: ["(", ")"],
  vertical: ["◠", "◡"],
};

const PADDING = " ";
const PADDING_WIDTH = stringWidth(PADDING) * 2;

export function say(text: string): string {
  return format(text, delimitersSay);
}

export function think(text: string): string {
  return format(text, delimitersThink);
}

function format(text: string, delimiters: Delimiters): string {
  const lines = text.split("\n");

  let maxWidth = 0;
  const linesWithWidth = lines.map<LineWithWidth>((line) => {
    const width = stringWidth(line);
    maxWidth = Math.max(maxWidth, width);
    return { line, width };
  });

  const top = ` ${delimiters.vertical[0].repeat(maxWidth + PADDING_WIDTH)} `;
  const bottom = ` ${delimiters.vertical[1].repeat(maxWidth + PADDING_WIDTH)} `;

  if (linesWithWidth.length === 1) {
    return [
      top,
      `${delimiters.only[0]}${PADDING}${text}${PADDING}${delimiters.only[1]}`,
      bottom,
    ].join("\n");
  }

  return [
    top,
    ...linesWithWidth.map((lw, idx) => {
      const text = padEndByStringWidth(lw, maxWidth);
      const delimiter = idx === 0
        ? delimiters.first
        : idx === linesWithWidth.length - 1
        ? delimiters.last
        : delimiters.middle;

      return `${delimiter[0]}${PADDING}${text}${PADDING}${delimiter[1]}`;
    }),
    bottom,
  ].join("\n");
}

function padEndByStringWidth(lw: LineWithWidth, maxWidth: number) {
  return lw.line + " ".repeat(maxWidth - lw.width);
}
