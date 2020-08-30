const englishOrdinalRules = new Intl.PluralRules("en", { type: "ordinal" });
const suffixes = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
  many: "th",
  zero: "th",
};

export default function ordinal(number: number) {
  const suffix = suffixes[englishOrdinalRules.select(number)];
  return (number + suffix);
}
