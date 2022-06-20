import { useEffect } from "react";

import { BookStatus } from "@type-reader/common";
import { demoBook } from "../utils/demo-book";
import useTimer from "../hooks/use-timer";
import useTypingAction from "../hooks/use-typing-action";
import {
  Textile,
  Typable,
  Entry,
  Stats,
  Paragraph,
  ButtonLink,
} from "../components";

import styles from "../styles/Book.module.scss";

const Demo = () => {
  const {
    meta: { title, author, status },
    body,
  } = demoBook;

  const { startTimer, stopTimer, readInSec } = useTimer();
  const {
    page,
    performAction,
    isReadingPaused,
    getStats,
    toggleReadingPaused,
    bookStatus,
  } = useTypingAction({
    body,
    totalPages: 2,
    pageIndex: 0,
    cursorIndex: "0,0",
    bookInitialStatus: status,
  });

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      e.preventDefault();

      if (!isReadingPaused) {
        performAction(e.key);
      }
    };

    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  });

  useEffect(() => {
    isReadingPaused ? stopTimer() : startTimer();

    if (bookStatus.current !== status) {
      stopTimer();
    }
  }, [isReadingPaused]);

  const calculateResult = () => {
    const { correctEntry, incorrectEntry, fixedEntry } = getStats();

    const totalEntry = correctEntry + incorrectEntry + fixedEntry;
    const wpm = Math.round(totalEntry / 5 / (readInSec / 60));
    const netWpm = Math.round(
      (totalEntry / 5 - (incorrectEntry - fixedEntry)) / (readInSec / 60)
    );
    const accuracy = Math.round((correctEntry / totalEntry) * 100);

    return { wpm, netWpm, readInSec, accuracy };
  };

  return (
    <Textile>
      <div className={styles.aboveTypable}>
        <h1>{title}</h1>
        <p>by {author}</p>
      </div>

      {isReadingPaused && bookStatus.current !== BookStatus.Completed && (
        <div className="d-flex flex-sm-column align-items-center text-light fs-4 my-4">
          <p>Type all the way through to see how good your typing is.</p>
          <button
            type="button"
            className="btn btn-light rounded-pill px-5 fs-5 fw-bold mt-3"
            onClick={() => toggleReadingPaused(false)}
          >
            Take the challenge
          </button>
        </div>
      )}

      {!isReadingPaused && bookStatus.current !== BookStatus.Completed && (
        <Typable>
          {page.paragraphs.map(({ paragraphIndex, paragraphContent }) => (
            <Paragraph key={paragraphIndex}>
              {paragraphContent.map(({ char, charIndex, state }) => (
                <Entry
                  key={charIndex}
                  char={char}
                  state={charIndex === page.cursorIndex ? "current" : state}
                />
              ))}
            </Paragraph>
          ))}
        </Typable>
      )}

      {isReadingPaused && bookStatus.current === BookStatus.Completed && (
        <div>
          <Stats data={calculateResult()} />
          <div className="d-grid gap-3 mt-5 col-6 mx-auto">
            <ButtonLink dest="/auth/signup" label="Register" />
            <ButtonLink dest="/auth/signin" label="Sign in" />
          </div>
        </div>
      )}
    </Textile>
  );
};

export default Demo;
