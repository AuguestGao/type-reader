import { useEffect, useState, MouseEvent, ReactNode } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { AxiosRequestHeaders } from "axios";
import dayjs from "dayjs";

import { BookBody, BookStatus } from "@type-reader/common";
import buildClient from "../../api/build-client";
import useTimer from "../../hooks/use-timer";
import useTypingAction from "../../hooks/use-typing-action";
import { doRequest } from "../../api/do-request";
import { getCurrentUser } from "../../api/get-current-user";
import { useAuth } from "../../context/user-context";
import {
  Textile,
  Typable,
  Entry,
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
    status: BookStatus;
    updatedAt: string;
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
  currentUser,
}: {
  book: BookProps;
  bookmark: BookmarkProps;
  currentUser: string;
}) => {
  const { setCurrentUser } = useAuth();
  useEffect(() => {
    setCurrentUser!(currentUser);
  }, []);

  const router = useRouter();

  const {
    meta: { title, author, bookId, totalPages, status, updatedAt },
    body,
  } = book;

  const [showTypable, toggleShowTypable] = useState(false);
  const { startTimer, stopTimer, readInSec } = useTimer();

  const {
    page,
    performAction,
    isReadingPaused,
    toggleReadingPaused,
    bookStatus,
    pageHistory,
    getStats,
    updatePageHistory,
  } = useTypingAction({
    body,
    totalPages,
    pageIndex: bookmark.pageIndex,
    cursorIndex: bookmark.cursorIndex,
    bookInitialStatus: book.meta.status,
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

  const addBookmark = async (url?: string) => {
    const { correctEntry, incorrectEntry, fixedEntry } = getStats();

    updatePageHistory();

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
        pageIndex: page.pageIndex,
        cursorIndex: page.cursorIndex,
      },
    });

    if (errors) {
      setError(errors);
    }

    if (url) {
      router.push(url);
    }
  };

  useEffect(() => {
    isReadingPaused ? stopTimer() : startTimer();

    const completeTheBook = async () => {
      await doRequest({
        url: `/api/books/${encodeURIComponent(bookId)}`,
        method: "patch",
        body: {},
      });
    };

    if (bookStatus.current !== book.meta.status) {
      completeTheBook();
      addBookmark("/statistics/latest");
    }
  }, [isReadingPaused]);

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

  const addBookmarkClicked = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    addBookmark("/statistics/latest");
  };

  return (
    <Textile>
      <div className={styles.aboveTypable}>
        <h1>{title}</h1>
        {author !== "Unknown" && <p>by {author}</p>}
      </div>

      {!showTypable ? (
        <>
          <BookStats
            data={{
              totalSecOnBook: bookmark.totalSecOnBook,
              progress:
                book.meta.status === BookStatus.Completed
                  ? 100
                  : Math.floor((bookmark.pageIndex / totalPages) * 100),
            }}
          >
            {book.meta.status === BookStatus.Completed ? (
              <p>Completed on {dayjs(updatedAt).format("MMM D, YYYY")}</p>
            ) : (
              ""
            )}
          </BookStats>
          <div className="d-grid gap-2 mt-5 col-6 mx-auto">
            <button
              type="button"
              className="btn btn-light fw-bold rounded-pill px-5 fs-5"
              onClick={startReadingClicked}
            >
              Start reading
            </button>
            <button
              type="button"
              className="btn btn-outline-light fw-bold rounded-pill px-5 fs-5"
              onClick={deleteBookClicked}
            >
              Delete book
            </button>
            <Link href="/books" passHref>
              <button
                type="button"
                className="btn btn-outline-light fw-bold rounded-pill px-5 fs-5 mt-5"
              >
                Back to books
              </button>
            </Link>
          </div>
        </>
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
              <p className='text-white text-center'>We are building your book now, come back to check soon.</p>
            )}
          </Typable>

          <div className={styles.belowTypable}>
            {isReadingPaused ? (
              <>
                <button
                  type="button"
                  className="btn btn-light fw-bold rounded-pill px-5 fs-5"
                  onClick={addBookmarkClicked}
                >
                  Add bookmark
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light fw-bold rounded-pill px-5 fs-5"
                  onClick={() => toggleReadingPaused(false)}
                >
                  Resume reading
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-outline-light fw-bold rounded-pill px-5 fs-5"
                onClick={() => toggleReadingPaused(true)}
              >
                Pause reading
              </button>
            )}
          </div>
        </div>
      )}

      {error}
    </Textile>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = context.req.headers as AxiosRequestHeaders;
  const client = buildClient(headers);

  try {
    const currentUser = await getCurrentUser(client);

    if (!currentUser) {
      return {
        redirect: {
          destination: "/auth/signin",
          permanent: false,
        },
      };
    }

    const bookId = context.params!.id as string;

    const bookRes = await client.get(
      `/api/books/${encodeURIComponent(bookId)}`
    );
    const bookmarkRes = await client.get(
      `/api/bookmark/${encodeURIComponent(bookId)}`
    );

    const book: BookProps = bookRes.data;
    const bookmark: BookmarkProps = bookmarkRes.data;

    return {
      props: {
        book,
        bookmark,
        currentUser: currentUser.displayName,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default OneBook;
