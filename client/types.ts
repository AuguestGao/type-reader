import { ChangeEvent } from "react";
// ! update Entry in common
import { EntryState } from "@type-reader/common";
// import { Entry } from "@type-reader/common";

export interface Entry {
  charIndex: string;
  char: string;
  pressedKey: string;
  state: EntryState;
}

export interface User {
  id: string;
  displayName: string;
}

export interface CurrentUser {
  currentUser: User | null;
}

export interface Book {
  id: string;
  title: string;
  body?: string;
  author: string;
  userId: string;
}

export interface BookBody {
  pageIndex: number;
  pageContent: string[][];
}

export interface Page {
  pageIndex: number;
  cursorIndex: string;
  paragraphs: Paragraph[];
  totalParagraphs: number;
}

export interface Paragraph {
  paragraphIndex: number;
  paragraphContent: Entry[];
  totalEntries: number;
}

export enum Flip {
  Stay = "STAY", // stay on this page
  NextPage = "NEXT_PAGE",
  PrevPage = "PREV_PAGE",
  NextParagraph = "NEXT_PARAGRAPH",
  PrevParagraph = "PREV_PARAGRAPH",
  NoNextPage = "NO_NEXT_PAGE", // at last page
  NoPrevPage = "NO_PREV_PAGE", // at 1st page
}

export interface FormField {
  type?: string;
  label: string;
  id: string;
  value: string;
  onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
}

export interface IStats {
  wpm: number;
  netWpm: number;
  readInSec: number;
  accuracy: number;
}

export interface IBookStats {
  totalSecsOnBook: number;
  progress: number;
}

export interface PageHistory {
  [key: string]: Page;
}
