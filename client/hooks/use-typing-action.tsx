import { useState, useRef } from "react";
import {
  BookBody,
  Entry_State,
  PageHistory,
  Page,
  Flip,
  Entry,
} from "../types";
import { renderableEntries } from "../utils/renderable-entries";

const useTypingAction = (body: BookBody[], initialPageIndex = 0) => {
  const totalPages = useRef(body.length);
  const pageHistory = useRef<PageHistory>({});
  const bookCompleted = useRef(false);

  const stats = useRef({ correctEntry: 0, incorrectEntry: 0, fixedEntry: 0 });
  const updateStats = (state: Entry_State, isPlus: Boolean) => {
    let { correctEntry, incorrectEntry, fixedEntry } = stats.current;

    switch (state) {
      case Entry_State.Correct:
        isPlus ? (correctEntry += 1) : (correctEntry -= 1);
        break;
      case Entry_State.Incorrect:
        isPlus ? (incorrectEntry += 1) : (incorrectEntry -= 1);
        break;
      case Entry_State.Fixed:
        isPlus ? (fixedEntry += 1) : (fixedEntry -= 1);
        break;
      default:
        console.log("Invalide update stats option");
    }

    stats.current = { correctEntry, incorrectEntry, fixedEntry };
  };

  const [isReadingPaused, toggleReadingPaused] = useState(true);

  const getHistory = (pageIndex: number) => {
    return pageHistory.current[pageIndex.toString()];
  };

  const getInitPageState = (initialPageIndex: number) => {
    const historyFound = getHistory(initialPageIndex);

    // no history for the page
    if (typeof historyFound === "undefined") {
      const pageContent = body.find(
        (page) => page.pageIndex === initialPageIndex
      )!.pageContent;

      return {
        pageIndex: initialPageIndex,
        cursorIndex: 0,
        entries: pageContent.map((char, charIndex) => ({
          charIndex,
          char,
          pressedKey: "",
          state: Entry_State.Untyped,
        })),
        totalEntries: pageContent.length,
      };
    }

    // found history
    const { cursorIndex, entries, totalEntries } = historyFound;

    return { pageIndex: initialPageIndex, cursorIndex, entries, totalEntries };
  };

  const [page, setPage] = useState<Page>(() =>
    getInitPageState(initialPageIndex)
  );

  const performAction = (pressedKey: string) => {
    switch (pressedKey) {
      case "Backspace":
        updateCursorAndPage(false);
        break;
      // case "Enter":
      // case"Tab":
      default:
        if (renderableEntries.includes(pressedKey)) {
          updateRenderableEntryState(pressedKey);
          updateCursorAndPage(true);
        }
    }
  };

  const updateRenderableEntryState = (pressedKey: string) => {
    const entriesCopy = [...page.entries];

    const entryFocused = entriesCopy[page.cursorIndex];
    const oldState = entryFocused.state;
    let newState = oldState;
    const showedKey = entryFocused.char;

    const isCorrectEntry = (pressedKey: string, showedKey: string) =>
      pressedKey === showedKey;

    // decide newState
    if (oldState === Entry_State.Untyped) {
      isCorrectEntry(pressedKey, showedKey)
        ? (newState = Entry_State.Correct)
        : (newState = Entry_State.Incorrect);
      updateStats(newState, true);
    } else if (
      oldState === Entry_State.Correct &&
      !isCorrectEntry(pressedKey, showedKey)
    ) {
      newState = Entry_State.Incorrect;
      updateStats(oldState, false);
      updateStats(newState, true);
    } else if (
      oldState === Entry_State.Incorrect &&
      isCorrectEntry(pressedKey, showedKey)
    ) {
      newState = Entry_State.Fixed;
      updateStats(oldState, false);
      updateStats(newState, true);
    } else if (
      oldState === Entry_State.Fixed &&
      !isCorrectEntry(pressedKey, showedKey)
    ) {
      newState = Entry_State.Incorrect;
      updateStats(oldState, false);
      updateStats(newState, true);
    }

    // update state if old !== new
    if (oldState !== newState) {
      entryFocused.state = newState;
      setPage((prev) => ({ ...prev, entries: entriesCopy }));
    }
  };

  const updateCursorAndPage = (isForward: Boolean) => {
    let nextCursorIndex: number;

    isForward
      ? (nextCursorIndex = page.cursorIndex + 1)
      : (nextCursorIndex = page.cursorIndex - 1);

    const flipDirection = getFlipDirection(nextCursorIndex);

    switch (flipDirection) {
      case Flip.Next:
        updatePageHistory();
        updatePageIndex(Flip.Next);
        break;
      case Flip.Previous:
        updatePageHistory();
        updatePageIndex(Flip.Previous);
        break;
      case Flip.Stay:
        // only update cursor index
        setPage((prev) => ({ ...prev, cursorIndex: nextCursorIndex }));
        break;
      case Flip.NoMoreNext:
        bookCompleted.current = true;
      case Flip.NoMorePrevious:
        updatePageHistory();
        toggleReadingPaused(true);
        break;
      default:
        console.log("Invalise Flip case");
    }
  };

  const getFlipDirection = (nextCursorIndex: number): Flip => {
    if (nextCursorIndex >= page.totalEntries) {
      if (page.pageIndex + 1 < totalPages.current) {
        return Flip.Next;
      } else {
        return Flip.NoMoreNext;
      }
    } else if (nextCursorIndex < 0) {
      if (page.pageIndex - 1 >= 0) {
        return Flip.Previous;
      } else {
        return Flip.NoMorePrevious;
      }
    } else {
      return Flip.Stay;
    }
  };

  const updatePageHistory = () => {
    pageHistory.current = { ...pageHistory.current, [page.pageIndex]: page };
  };

  const updatePageIndex = (direction: Flip) => {
    const isForward = direction === Flip.Next;
    let nextPageIndex = page.pageIndex;
    isForward ? (nextPageIndex += 1) : (nextPageIndex -= 1);
    setPage(getInitPageState(nextPageIndex));
  };

  const getStats = () => {
    return stats.current;
  };

  return {
    page,
    performAction,
    isReadingPaused,
    toggleReadingPaused,
    bookCompleted,
    getStats,
  };
};

export default useTypingAction;
