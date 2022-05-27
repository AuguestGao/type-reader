import { ChangeEvent } from "react";

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
  pageContent: string[];
}

export enum Entry_State {
  Untyped = "untyped",
  Correct = "correct",
  Incorrect = "incorrect",
  Fixed = "fixed",
}

export interface Entry {
  charIndex: number;
  char: string;
  pressedKey: string;
  state: Entry_State;
}

export interface Page {
  pageIndex: number;
  cursorIndex: number;
  totalEntries: number;
  entries: Entry[];
}

export enum Flip {
  Next = "NEXT",
  Previous = "PREVIOUS",
  Stay = "STAY", // stay on this page
  NoMoreNext = "NO_MORE_NEXT", // at last page
  NoMorePrevious = "NO_MORE_PREVIOUS", // at 1st page
}

export interface PageHistory {
  // key is pageIndex
  [key: string]: {
    pageIndex: number;
    cursorIndex: number;
    totalEntries: number;
    entries: Entry[];
  };
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
