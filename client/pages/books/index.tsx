import { useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import { AxiosRequestHeaders } from "axios";

import { useAuth } from "../../context/user-context";
import buildClient from "../../api/build-client";
import { Textile } from "../../components";
import { BookStatus } from "@type-reader/common";

import styles from "../../styles/Book.module.scss";
import { redirectIfNotAuth } from "../../api/redirect-if-not-auth";

interface IBookInfo {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
}

const Books = ({ books }: { books: IBookInfo[] | [] }) => {
  const { currentUser } = useAuth();
  useEffect(() => {
    if (!currentUser) {
      Router.push("/auth/signin");
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <Textile>
        <p>Loading...</p>
      </Textile>
    );
  }
  return (
    <Textile>
      <h1>Book shelf</h1>
      {books.length === 0 ? (
        <p className="text-center text-white">
          3 book slots left, add your first book now.
        </p>
      ) : (
        <ul className={styles.bookUl}>
          {books.map((book) => (
            <li key={book.id}>
              <Link href={`/books/${encodeURIComponent(book.id)}`} passHref>
                <a>
                  {book.status === BookStatus.Completed && "✔️  "}🕮&ensp;
                  {book.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {books.length < 3 ? (
        <div className="mt-4 d-grid gap-2 d-md-flex justify-content-md-center">
          <Link href="/books/create" passHref>
            <a className="btn btn-dark" role="button">
              Add a book
            </a>
          </Link>
        </div>
      ) : null}
    </Textile>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = context.req.headers as AxiosRequestHeaders;
  const client = buildClient(headers);

  const currentUser = await redirectIfNotAuth(client);

  if (!currentUser) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  try {
    const { data } = await client.get("/api/books");
    return {
      props: {
        books: data,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default Books;
