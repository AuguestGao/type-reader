import { BookBody } from "@type-reader/common";
import { buildPageContent } from "./build-page-content";

export const pageBook = (body: BookBody[]) => {
  const numWordsOnPage = 120;

  let { pageIndex, pageContent } = body[0];
  const rawBody = pageContent[0][0];

  const pagedBody: BookBody[] = [];

  // split to pargraphs: \n or \r\n
  let re = /[\r?\n\f]/gm;
  const rawParagraphs = rawBody.split(re);

  let carriedWords: string[] = [];
  let words: string[] = [];

  while (rawParagraphs.length) {
    const paragraph = rawParagraphs.shift();

    if (
      typeof paragraph === "undefined" ||
      paragraph.replace(/\s/g, "").length === 0
    ) {
      continue;
    }

    words = carriedWords.concat(paragraph.split(" "));

    // carry the process to next paragraph if less than pre-decided number of words
    if (words.length < numWordsOnPage) {
      carriedWords = [...words, "↵"];
      continue;
    }

    carriedWords = words.slice(numWordsOnPage);
    words = words.slice(0, numWordsOnPage);

    pageContent = buildPageContent(words);

    pagedBody.push({ pageIndex, pageContent });
    pageIndex++;
    words = [];
  }

  while (carriedWords.length) {
    words = carriedWords.slice(0, numWordsOnPage);
    carriedWords = carriedWords.slice(numWordsOnPage);

    pageContent = buildPageContent(words);
    pagedBody.push({ pageIndex, pageContent });
    pageIndex++;
  }

  return pagedBody;
};
