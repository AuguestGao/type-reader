import { useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import { AxiosRequestHeaders } from "axios";

import { useAuth } from "../../context/user-context";
import buildClient from "../../api/build-client";
import Textile from "../../components/Textile";

import styles from "../../styles/Book.module.scss";

interface IBookInfo {
  id: string;
  title: string;
  author: string;
}

const Books = ({ books }: { books: IBookInfo[] | [] }) => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      Router.push("/");
    }
  }, [currentUser]);

  return (
    <Textile>
      <h1>Book shelf</h1>
      {books.length === 0 ? (
        <p className="text-center text-white">Empty shelf...</p>
      ) : (
        <ul className={styles.bookUl}>
          {books.map((book) => (
            <li key={book.id}>
              <Link href={`/books/${encodeURIComponent(book.id)}`} passHref>
                <a>🕮&ensp;{book.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 d-grid gap-2 d-md-flex justify-content-md-center">
        <Link href="/books/create" passHref>
          <a className="btn btn-dark" role="button">
            Add a book
          </a>
        </Link>
      </div>
    </Textile>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = context.req.headers as AxiosRequestHeaders;
  const client = buildClient(headers);

  try {
    const { data } = await client.get("/api/books");
    return {
      props: {
        books: data,
      },
    };
  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      books: [],
    },
  };
};

export default Books;
