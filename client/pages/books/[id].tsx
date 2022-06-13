import { useEffect, useState, MouseEvent, ReactNode } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { AxiosError, AxiosRequestHeaders, AxiosResponse } from "axios";

import { BookBody } from "@type-reader/common";
import useRequest from "../../hooks/use-request";
import buildClient from "../../api/build-client";
import { useAuth } from "../../context/user-context";
import useTimer from "../../hooks/use-timer";
import useTypingAction from "../../hooks/use-typing-action";
import { doRequest } from "../../api/do-request";
import {
  Textile,
  Typable,
  Entry,
  DigitalClock,
  BookStats,
  Paragraph,
} from "../../components";

import styles from "../../styles/Book.module.scss";

interface BookProps {
  meta: {
    bookId: string;
    title: string;
    author: string;
    totalPages: number;
  };
  body: BookBody[];
}

interface BookmarkProps {
  pageIndex: number;
  cursorIndex: string;
  totalSecOnBook: number;
  prevText: string;
}

const OneBook = ({
  book,
  bookmark,
}: {
  book: BookProps;
  bookmark: BookmarkProps;
}) => {
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth/signin");
    }
  }, [currentUser]);

  const {
    meta: { title, author, bookId, totalPages },
    body,
  } = book;

  const { pageIndex, cursorIndex, totalSecOnBook, prevText } = bookmark;

  const [showTypable, toggleShowTypable] = useState(false);
  const { startTimer, stopTimer, readInSec } = useTimer();

  const {
    page,
    performAction,
    isReadingPaused,
    toggleReadingPaused,
    bookCompleted,
    pageHistory,
    stats,
    updatePageHistory,
  } = useTypingAction(body, totalPages, pageIndex);

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

  useEffect(() => {
    updatePageHistory();

    const completeTheBook = async () => {
      await doRequest({
        url: `/api/books/${encodeURIComponent(bookId)}`,
        method: "patch",
        body: {},
      });
    };

    completeTheBook();
  }, [bookCompleted]);

  const [error, setError] = useState<null | ReactNode>(null);

  const startReadingClicked = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleReadingPaused((prev) => !prev);
    toggleShowTypable((prev) => !prev);
  };

  const deleteBookClicked = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { errors } = await doRequest({
      url: `/api/books/${encodeURIComponent(bookId)}`,
      method: "delete",
      body: {},
    });

    if (errors) {
      setError(errors);
    } else {
      router.push("/books");
    }
  };

  const addBookmarkClicked = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { correctEntry, incorrectEntry, fixedEntry } = stats.current;
    updatePageHistory();
    console.log(pageHistory);

    const { errors } = await doRequest({
      url: "/api/stats",
      method: "patch",
      body: {
        bookId,
        correctEntry,
        incorrectEntry,
        fixedEntry,
        readInSec,
        pageHistory: pageHistory.current,
        pageIndex,
        cursorIndex,
      },
    });

    if (errors) {
      setError(errors);
    } else {
      router.push("/statistics/latest");
    }
  };

  return (
    <Textile>
      <div className={styles.aboveTypable}>
        <h1>{book.meta.title}</h1>
        {author !== "Unknown" && <p>by {author}</p>}
      </div>

      {<div>{error}</div>}

      {!showTypable ? (
        <div>
          <BookStats
            data={{
              totalSecOnBook,
              progress: Math.round(((pageIndex + 1) / totalPages) * 100),
            }}
          />
          <div className="d-grid gap-2 mt-5 col-6 mx-auto">
            <button
              type="button"
              className="btn btn-warning"
              onClick={startReadingClicked}
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
            {page.paragraphs.length ? (
              page.paragraphs.map(({ paragraphIndex, paragraphContent }) => (
                <Paragraph key={paragraphIndex}>
                  {paragraphContent.map(({ char, charIndex, state }) => (
                    <Entry
                      key={charIndex}
                      char={char}
                      state={charIndex === page.cursorIndex ? "current" : state}
                    />
                  ))}
                </Paragraph>
              ))
            ) : (
              <p>We are building your book now, come back to check soon.</p>
            )}
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
                    onClick={addBookmarkClicked}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = context.req.headers as AxiosRequestHeaders;
  const client = buildClient(headers);

  const bookId = context.params!.id as string;

  const bookRes = await client.get(`/api/books/${encodeURIComponent(bookId)}`);
  const bookmarkRes = await client.get(
    `/api/bookmark/${encodeURIComponent(bookId)}`
  );

  if (bookRes.status !== 200 || bookmarkRes.status !== 200) {
    return {
      notFound: true,
    };
  }

  const book: BookBody = bookRes.data;
  const bookmark: BookmarkProps = bookmarkRes.data;

  return {
    props: {
      book,
      bookmark,
    },
  };
};

export default OneBook;
