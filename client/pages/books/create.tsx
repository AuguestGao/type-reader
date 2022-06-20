import { FormEvent, useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import Router from "next/router";
import { AxiosRequestHeaders } from "axios";

import { BookForm, FormInput, FormTextarea, Textile } from "../../components";
import useRequest from "../../hooks/use-request";
import buildClient from "../../api/build-client";
import { getCurrentUser } from "../../api/get-current-user";
import { useAuth } from "../../context/user-context";

import styles from "../../styles/Book.module.scss";

interface IBook {
  title: string;
  author: string;
  body: string;
}

const CreateBook = ({ currentUser }: { currentUser: string }) => {
  const { setCurrentUser } = useAuth();
  useEffect(() => {
    setCurrentUser!(currentUser);
  }, []);

  const [book, setBook] = useState<IBook>({
    title: "",
    author: "",
    body: "",
  });

  useEffect(() => {
    return () =>
      setBook({
        title: "",
        author: "",
        body: "",
      });
  }, []);

  const { doRequest, errors } = useRequest({
    url: "/api/books",
    method: "post",
    body: {
      title: book.title,
      author: book.author,
      body: book.body,
    },

    onSuccess: () => {
      Router.push("/books");
    },
  });

  const uploadBook = async (e: FormEvent) => {
    e.preventDefault();

    await doRequest();
  };

  const cancelCreate = (e: FormEvent) => {
    e.preventDefault();
    Router.push("/books");
  };

  return (
    <Textile>
      <BookForm onSubmit={uploadBook}>
        <h2 className={styles.formTitle}>Add a book</h2>

        <FormInput
          type="text"
          label="Title"
          id="title"
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
        />
        <FormInput
          type="text"
          label="Author"
          id="author"
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
        />
        <FormTextarea
          label="Body"
          id="body"
          value={book.body}
          onChange={(e) => setBook({ ...book, body: e.target.value })}
        />

        <div>{errors}</div>

        <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
          <button
            className="btn btn-outline-light me-md-2 col-5 fw-bold rounded-pill px-5 fs-5"
            type="button"
            onClick={cancelCreate}
          >
            Cancel
          </button>
          <button
            className="btn btn-light me-md-2 col-5 fw-bold rounded-pill px-5 fs-5"
            type="submit"
          >
            Add
          </button>
        </div>
      </BookForm>
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

    return {
      props: {
        currentUser: currentUser.displayName,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default CreateBook;
