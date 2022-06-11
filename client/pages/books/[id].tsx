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

const OneBook = ({ book }: { book: BookProps }) => {
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth/signin");
    }
  }, [currentUser]);

  // useEffect(() => {
  //   if (!book) {
  //     router.push("/books");
  //   }
  // }, []);

  // const [err, setErr] = useState(typeof error === "undefined" ? null : error);

  const {
    meta: { title, author, bookId },
    body,
  } = book;

  const [showTypable, toggleShowTypable] = useState(false);
  const { startTimer, stopTimer, readInSec } = useTimer();

  const {
    page,
    performAction,
    isReadingPaused,
    toggleReadingPaused,
    bookCompleted,
    pageHistory,
  } = useTypingAction(body);

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      e.preventDefault();

      console.log(e.key);

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
    url: `/api/books/${encodeURIComponent(bookId)}`,
    method: "delete",
    body: {},

    onSuccess: () => {
      router.push("/books");
    },
  });

  const startReadingClicked = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleReadingPaused((prev) => !prev);
    toggleShowTypable((prev) => !prev);
  };

  const deleteBookClicked = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const bookId = router.pathname.replace("/books/", "");
    console.log(bookId);
  };

  // if (err) {
  //   return <Textile>{err}</Textile>;
  // }

  return (
    <Textile>
      <div className={styles.aboveTypable}>
        <h1>{book.meta.title}</h1>
        {author !== "Unknown" && <p>by {author}</p>}
      </div>

      {/* {<div>{error}</div>} */}

      {!showTypable ? (
        <div>
          <BookStats data={{ totalSecsOnBook: 1234, progress: 23 }} />
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
                    onClick={() => console.log(pageHistory)}
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

  // if (!context.params?.id) {
  //   return {
  //     props: {
  //       book: null,
  //     },
  //   };
  // }

  const bookId = context.params!.id as string;

  // try {
  const res = await client.get(`/api/books/${encodeURIComponent(bookId)}`);

  if (res.status !== 200) {
    return {
      notFound: true,
    };
  }

  const book: BookBody = res.data;
  return {
    props: {
      book,
    },
  };
  // } catch (err) {
  // const errors = err as AxiosError;
  // console.log(err.message);
  // const errorMessage = (
  //   <div className="alert alert-danger">
  //     <ul className="my-0">
  //       {errors.response!.data.errors.map((error: { message: string }) => (
  //         <li key={error.message}>{error.message}</li>
  //       ))}
  //     </ul>
  //   </div>
  // );

  // return {
  //   props: {
  //     error: JSON.stringify(err),
  //   },
  // };
  // }
};

export default OneBook;
