import { BookStatus } from "@type-reader/common";
import { body } from "./demo-book-body";

const meta = {
  bookId: "demo-book",
  title: "Alice's Adventures in Wonderland (Except)",
  author: "Lewis Carroll",
  totalPages: 2,
  status: BookStatus.Paged,
};

export const demoBook = { meta, body };
