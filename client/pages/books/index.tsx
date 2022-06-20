import { useEffect } from "react";
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import { AxiosRequestHeaders } from "axios";

import buildClient from "../../api/build-client";
import { ButtonLink, Textile } from "../../components";
import { BookStatus } from "@type-reader/common";
import { getCurrentUser } from "../../api/get-current-user";
import { useAuth } from "../../context/user-context";

import styles from "../../styles/Book.module.scss";

interface IBookInfo {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
}

const Books = ({
  books,
  currentUser,
}: {
  books: IBookInfo[] | [];
  currentUser: string;
}) => {
  const { setCurrentUser } = useAuth();
  useEffect(() => {
    setCurrentUser!(currentUser);
  }, []);

  return (
    <Textile>
      <h1>Bookshelf</h1>
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
                  🕮&ensp;{book.title}
                  {book.status === BookStatus.Completed && " (completed)"}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {books.length < 3 ? (
        <div className="mt-4 d-grid gap-2 d-md-flex justify-content-md-center">
          <ButtonLink dest="/books/create" label="new Book" isOutlined={true} />
        </div>
      ) : null}
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

    const { data } = await client.get("/api/books");

    return {
      props: {
        books: data,
        currentUser: currentUser.displayName,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  }
};

export default Books;
