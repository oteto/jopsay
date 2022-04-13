import { stringWidth } from "~/deps.ts";

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

export type Balloon = "say" | "think" | "shout";

const delimitersSay: Delimiters = {
  first: ["/", "\\"],
  middle: ["|", "|"],
  last: ["\\", "/"],
  only: ["|", "|"],
  vertical: ["_", "-"],
};

const delimitersThink: Delimiters = {
  first: ["(", ")"],
  middle: ["(", ")"],
  last: ["(", ")"],
  only: ["(", ")"],
  vertical: ["◠", "◡"],
};

const delimiterShout: Delimiters = {
  first: ["⪓", "⪓"],
  middle: ["⪓", "⪓"],
  last: ["⪓", "⪓"],
  only: ["⪓", "⪓"],
  vertical: ["⩕", "⩖"],
};

const PADDING = " ";
const PADDING_WIDTH = stringWidth(PADDING) * 2;

export function say(text: string): string {
  return format(text, delimitersSay);
}

export function think(text: string): string {
  return format(text, delimitersThink);
}

export function shout(text: string): string {
  return format(text, delimiterShout);
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
      const text = lw.line + " ".repeat(maxWidth - lw.width);
      const [start, end] = idx === 0
        ? delimiters.first
        : idx === linesWithWidth.length - 1
        ? delimiters.last
        : delimiters.middle;

      return `${start}${PADDING}${text}${PADDING}${end}`;
    }),
    bottom,
  ].join("\n");
}
