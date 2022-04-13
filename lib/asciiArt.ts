const margin = " ".repeat(4);

export const jopsAA = (l: string) =>
  String.raw`
${margin}${l}        __
${margin} ${l}      |@ |
${margin}  ${l}  _  |  | __
${margin}    | |_|! |/ _|
${margin}     \__op/ \__\
${margin}        /_| |__/
`;

const escBlue = "\x1b[36m";
const escRed = "\x1b[31m";
const escWhite = "\x1b[37m";
const escOrange = "\x1b[385;91m";
const escGreen = "\x1b[32m";

export const jopsColorAA = (l: string) => `
${margin}${l}   ${escBlue}     __  ${escWhite}
${margin} ${l}  ${escBlue}    |@ | ${escWhite}
${margin}  ${l} ${escBlue} _  |  | ${escRed}__
${margin}\    ${escBlue}| |_|/ |${escRed}/_|
${margin}\    ${escBlue} \\__${escOrange}o${escGreen}p${escBlue}/ ${escRed}\\_\\
${margin}\    ${escWhite}    /_| ${escRed}|_/
`;
