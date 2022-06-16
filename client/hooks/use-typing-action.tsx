import { useState, useRef } from "react";
import {
  EntryState,
  Page,
  Paragraph,
  PageHistory,
  BookBody,
  BookStatus,
} from "@type-reader/common";
import { Flip } from "../types";
import { renderableEntries } from "../utils/renderable-entries";
import { parseIndex } from "../utils/parse-index";

const useTypingAction = ({
  body,
  totalPages,
  pageIndex,
  cursorIndex,
  bookInitialStatus,
}: {
  body: BookBody[];
  totalPages: number;
  pageIndex: number;
  cursorIndex: string;
  bookInitialStatus: BookStatus;
}) => {
  const pageHistory = useRef<PageHistory>({});
  const bookStatus = useRef(bookInitialStatus);
  const stats = useRef({ correctEntry: 0, incorrectEntry: 0, fixedEntry: 0 });
  const [isReadingPaused, toggleReadingPaused] = useState(true);

  const updateStats = (state: EntryState, isPlus: Boolean) => {
    let { correctEntry, incorrectEntry, fixedEntry } = stats.current;

    switch (state) {
      case EntryState.Correct:
        isPlus ? (correctEntry += 1) : (correctEntry -= 1);
        break;
      case EntryState.Incorrect:
        isPlus ? (incorrectEntry += 1) : (incorrectEntry -= 1);
        break;
      case EntryState.Fixed:
        isPlus ? (fixedEntry += 1) : (fixedEntry -= 1);
        break;
      default:
        console.log("Invalide update stats option");
    }

    stats.current = { correctEntry, incorrectEntry, fixedEntry };
  };

  const getHistory = (pageIndex: number) => {
    return pageHistory.current[pageIndex.toString()];
  };

  const getCurrPageState = (
    pageIndex: number,
    cursorInitIndex = "0,0"
  ): Page => {
    const historyFound = getHistory(pageIndex);

    // no history for the page
    if (typeof historyFound === "undefined") {
      const pageContent = body.find(
        (page) => page.pageIndex === pageIndex
      )!.pageContent;

      const totalParagraphs = pageContent.length;

      const paragraphs: Paragraph[] = [];

      for (
        let paragraphIndex = 0;
        paragraphIndex < totalParagraphs;
        paragraphIndex++
      ) {
        const paragraphContent = pageContent[paragraphIndex].map(
          (char, charIndex) => ({
            charIndex: `${paragraphIndex},${charIndex}`,
            char,
            pressedKey: "",
            state: EntryState.Untyped,
          })
        );

        paragraphs.push({
          paragraphIndex,
          paragraphContent,
          totalEntries: paragraphContent.length,
        });
      }

      return {
        pageIndex,
        cursorIndex: cursorInitIndex,
        paragraphs,
        totalParagraphs,
      };
    }

    // found history
    const { cursorIndex, paragraphs, totalParagraphs } = historyFound;

    return {
      pageIndex,
      cursorIndex,
      paragraphs,
      totalParagraphs,
    };
  };

  const [page, setPage] = useState<Page>(() =>
    getCurrPageState(pageIndex, cursorIndex)
  );

  const performAction = (pressedKey: string) => {
    switch (pressedKey) {
      case "Backspace":
        updateCursorAndPage(false);
        break;
      case "Enter":
        updateRenderableEntryState("↵");
        updateCursorAndPage(true);
        break;
      case "Tab":
        updateRenderableEntryState("↹");
        updateCursorAndPage(true);
        break;
      default:
        if (renderableEntries.includes(pressedKey)) {
          updateRenderableEntryState(pressedKey);
          updateCursorAndPage(true);
        }
    }
  };

  const updateRenderableEntryState = (pressedKey: string) => {
    const paragraphsCopy = page.paragraphs;
    const [pIndex, cIndex] = parseIndex(page.cursorIndex);
    const entriesCopy = paragraphsCopy[pIndex].paragraphContent;

    const entryFocused = entriesCopy[cIndex];
    const oldState = entryFocused.state;
    let newState = oldState;
    const showedKey = entryFocused.char;

    const isCorrectEntry = (pressedKey: string, showedKey: string) =>
      pressedKey === showedKey;

    // decide newState
    if (oldState === EntryState.Untyped) {
      isCorrectEntry(pressedKey, showedKey)
        ? (newState = EntryState.Correct)
        : (newState = EntryState.Incorrect);
      updateStats(newState, true);
    } else if (
      oldState === EntryState.Correct &&
      !isCorrectEntry(pressedKey, showedKey)
    ) {
      newState = EntryState.Incorrect;
      updateStats(oldState, false);
      updateStats(newState, true);
    } else if (
      oldState === EntryState.Incorrect &&
      isCorrectEntry(pressedKey, showedKey)
    ) {
      newState = EntryState.Fixed;
      updateStats(oldState, false);
      updateStats(newState, true);
    } else if (
      oldState === EntryState.Fixed &&
      !isCorrectEntry(pressedKey, showedKey)
    ) {
      newState = EntryState.Incorrect;
      updateStats(oldState, false);
      updateStats(newState, true);
    }

    // update state if old !== new
    if (oldState !== newState) {
      entryFocused.state = newState;
      entryFocused.pressedKey = pressedKey;
      setPage((prev) => ({ ...prev, paragraphs: paragraphsCopy }));
    }
  };

  const updateCursorAndPage = (isForward: Boolean) => {
    let nextCursorIndex: number;
    const [pIndex, cIndex] = parseIndex(page.cursorIndex);

    isForward ? (nextCursorIndex = cIndex + 1) : (nextCursorIndex = cIndex - 1);

    const flipDirection = getFlipInstruction(nextCursorIndex);

    switch (flipDirection) {
      case Flip.NextParagraph:
        setPage((prev) => ({
          ...prev,
          cursorIndex: `${pIndex + 1},0`,
        }));
        break;
      case Flip.PrevParagraph:
        setPage((prev) => ({
          ...prev,
          cursorIndex: `${pIndex - 1},${
            page.paragraphs[pIndex - 1].totalEntries - 1
          }`,
        }));
        break;
      case Flip.NextPage:
        updatePageHistory();
        updatePageIndex(Flip.NextPage);
        break;
      case Flip.PrevPage:
        updatePageHistory();
        updatePageIndex(Flip.PrevPage);
        break;
      case Flip.NoNextPage:
        toggleReadingPaused(true);
        bookStatus.current = BookStatus.Completed;
      case Flip.NoPrevPage:
        updatePageHistory();
        break;
      case Flip.Stay:
        // only update cursor index
        setPage((prev) => ({
          ...prev,
          cursorIndex: `${pIndex},${nextCursorIndex}`,
        }));
        break;
      default:
        console.log("Invalid Flip case");
    }
  };

  const getFlipInstruction = (nextCursorIndex: number): Flip => {
    const [pIndex, _] = parseIndex(page.cursorIndex);
    const currParagraph = page.paragraphs[pIndex];

    if (nextCursorIndex >= currParagraph.totalEntries) {
      if (currParagraph.paragraphIndex + 1 >= page.totalParagraphs) {
        if (page.pageIndex + 1 < totalPages) {
          return Flip.NextPage;
        } else {
          return Flip.NoNextPage;
        }
      } else {
        return Flip.NextParagraph;
      }
    } else if (nextCursorIndex < 0) {
      if (currParagraph.paragraphIndex - 1 < 0) {
        if (page.pageIndex - 1 >= 0) {
          return Flip.PrevPage;
        } else {
          return Flip.NoPrevPage;
        }
      } else {
        return Flip.PrevParagraph;
      }
    } else {
      return Flip.Stay;
    }
  };

  const updatePageHistory = () => {
    pageHistory.current = { ...pageHistory.current, [page.pageIndex]: page };
  };

  const updatePageIndex = (direction: Flip) => {
    const isForward = direction === Flip.NextPage;
    let nextPageIndex = page.pageIndex;
    isForward ? nextPageIndex++ : nextPageIndex--;
    setPage(getCurrPageState(nextPageIndex));
  };

  const getStats = () => {
    return stats.current;
  };

  return {
    page,
    performAction,
    isReadingPaused,
    toggleReadingPaused,
    bookStatus,
    getStats,
    pageHistory,
    updatePageHistory,
    stats,
  };
};

export default useTypingAction;
