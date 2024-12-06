export const positiveWordsList = [
  'happy',
  'happier',
  'joy',
  'excited',
  'cheerful',
  'great',
  'glad',
  'better',
  'delighted',
  'content',
  'elated',
  'satisfied',
];

export const negativeWordsList = [
  'depressed',
  'disappointed',
  'displeased',
  'frustrated',
  'miserable',
  'sad',
  'terrible',
  'upset',
  'worse',
  'bad',
  'unhappy',
  'gloomy',
  'downcast',
  'hopeless',
  'blue',
];

export const angryWordsList = [
  'angry',
  'furious',
  'rage',
  'mad',
  'irritated',
  'outraged',
  'annoyed',
  'infuriated',
];

export function isPositiveWord(word: string): boolean {
  return positiveWordsList.includes(word.toLowerCase());
}

export function isNegativeWord(word: string): boolean {
  return negativeWordsList.includes(word.toLowerCase());
}

export function isAngryWord(word: string): boolean {
  return angryWordsList.includes(word.toLowerCase());
}
