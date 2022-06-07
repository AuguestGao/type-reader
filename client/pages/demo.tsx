import { useEffect } from "react";
import Link from "next/link";

import { demoBook } from "../utils/demo-book";
import useTimer from "../hooks/use-timer";
import useTypingAction from "../hooks/use-typing-action";
import { Textile, Typable, Entry, DigitalClock, Stats } from "../components";

import styles from "../styles/Book.module.scss";

const Demo = () => {
  const {
    meta: { title, author },
    body,
  } = demoBook;

  const { startTimer, stopTimer, readInSec } = useTimer();
  const {
    page,
    performAction,
    isReadingPaused,
    toggleReadingPaused,
    bookCompleted,
    getStats,
  } = useTypingAction(body);

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
      {bookCompleted.current ? (
        <div>
          <Stats data={calculateResult()} />
          <div className="d-grid gap-2 mt-5 col-6 mx-auto">
            <Link href="/auth/signup" passHref>
              <button type="button" className="btn btn-danger m-2">
                Sign Up
              </button>
            </Link>
            <Link href="/auth/signin" passHref>
              <button type="button" className="btn btn-warning m-2">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.aboveTypable}>
            <h1>{title}</h1>
            {author !== "Unknown" && <p>by {author}</p>}
          </div>

          <Typable>
            {page.entries.map(({ char, charIndex, state }) => (
              <Entry
                key={charIndex}
                char={char}
                state={charIndex === page.cursorIndex ? "current" : state}
              />
            ))}
          </Typable>

          <div className={styles.belowTypable}>
            <DigitalClock />
            <div className="buttons">
              {isReadingPaused ? (
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => toggleReadingPaused(false)}
                >
                  Resume Reading
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => toggleReadingPaused(true)}
                >
                  Pause Reading
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Textile>
  );
};

export default Demo;
