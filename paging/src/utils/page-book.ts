import { BookBody } from "@type-reader/common";
import { regexList } from "./regex-list";

export const pageBook = (body: BookBody[]) => {
  const numWordsOnPage = 30;

  let { pageIndex, pageContent } = body[0];
  const rawBody = pageContent[0][0];

  const pagedBody: BookBody[] = [];

  // split to pargraphs: \n or \r\n
  let re = /[\r?\n\f]/gm;
  const rawParagraphs = rawBody.split(re);

  let carriedWords: string[] = [];

  while (rawParagraphs.length) {
    pageContent = [];
    const paragraph = rawParagraphs.shift();

    if (
      typeof paragraph === "undefined" ||
      paragraph.replace(/\s/g, "").length === 0
    ) {
      continue;
    }

    let words = carriedWords.concat(paragraph!.split(" "));

    // carry the process to next paragraph if less than pre-decided number of words
    if (words.length < numWordsOnPage) {
      carriedWords = [...words, "↵"];
      continue;
    }

    let chars: string[] = [];

    carriedWords = words.slice(numWordsOnPage);
    words = words.slice(0, numWordsOnPage);

    for (let word of words) {
      if (word === "↵") {
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
    pageContent.push(chars);
    pagedBody.push({ pageIndex, pageContent });
    pageIndex++;
  }

  return pagedBody;
};
