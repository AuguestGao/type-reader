import { regexList } from "./regex-list";

export const buildPageContent = (words: string[]) => {
  const pageContent: string[][] = [];
  let chars: string[] = [];

  for (let word of words) {
    if (word === "↵") {
      chars[chars.length - 1] = "↵";
      pageContent.push(chars);
      chars = [];
      continue;
    }

    Object.values(regexList).forEach(
      ({ re, replacedBy }) => (word = word.replace(re, replacedBy))
    );

    for (let w of word) {
      if (w === "”") {
        chars.push('"');
        continue;
      }

      chars.push(w);
    }

    chars.push(" ");
  }

  if (words[words.length - 1] !== "↵") {
    pageContent.push(chars);
  }

  return pageContent;
};
