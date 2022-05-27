import { useEffect, useState, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import useTimer from "../../hooks/use-timer";
import useRequest from "../../hooks/use-request";
import useTypingAction from "../../hooks/use-typing-action";
import {
  Textile,
  Typable,
  Entry,
  DigitalClock,
  BookStats,
} from "../../components";

import styles from "../../styles/Book.module.scss";

import { demoBook } from "../../utils/demoBook";

const Dev = () => {
  const {
    meta: { title, author },
    body,
  } = demoBook;

  const router = useRouter();
  const [showTypable, toggleShowTypable] = useState(false);

  const { startTimer, stopTimer, readInSec } = useTimer();
  const {
    page,
    performAction,
    isReadingPaused,
    toggleReadingPaused,
    bookCompleted,
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

  const { doRequest, errors } = useRequest({
    url: "/api/books/id",
    method: "delete",
    body: {},

    onSuccess: () => {
      router.push("/");
    },
  });

  const deleteBookClicked = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const bookId = router.pathname.replace("/books/", "");
    console.log(bookId);
  };

  return (
    <Textile>
      <div className={styles.aboveTypable}>
        <h1>{title}</h1>
        {author !== "Unknown" && <p>by {author}</p>}
      </div>
      {!showTypable ? (
        <div>
          <BookStats data={{ totalSecsOnBook: 1234, progress: 23 }} />
          <div className="d-grid gap-2 mt-5 col-6 mx-auto">
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => toggleShowTypable(true)}
            >
              Start Reading
            </button>
            <button
              type="button"
              className="btn btn-dark"
              onClick={deleteBookClicked}
            >
              Delete book
            </button>
            <Link href="/books" passHref>
              <button type="button" className="btn btn-outline-light mt-5">
                Back to my books
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
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
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic mixed styles example"
                >
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => console.log("add bk")}
                  >
                    Add Bookmark
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => toggleReadingPaused(false)}
                  >
                    Resume Reading
                  </button>
                </div>
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

export default Dev;
