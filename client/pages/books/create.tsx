import { FormEvent, useEffect, useState } from "react";
import type { NextPage } from "next";
import Router from "next/router";

import { BookForm, FormInput, FormTextarea, Textile } from "../../components";
import useRequest from "../../hooks/use-request";
import { useAuth } from "../../context/user-context";

import styles from "../../styles/Book.module.scss";

interface IBook {
  title: string;
  author: string;
  body: string;
}

const CreateBook: NextPage = () => {
  const { currentUser } = useAuth();

  const [book, setBook] = useState<IBook>({
    title: "",
    author: "",
    body: "",
  });

  useEffect(() => {
    if (!currentUser) {
      Router.push("/auth/signin");
    }

    return () =>
      setBook({
        title: "",
        author: "",
        body: "",
      });
  }, [currentUser]);

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

  if (!currentUser) {
    return (
      <Textile>
        <p>Loading...</p>
      </Textile>
    );
  }

  return (
    <Textile>
      <BookForm onSubmit={uploadBook}>
        <h2 className={styles.formTitle}>Upload a new book</h2>

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
          label="Book body"
          id="body"
          value={book.body}
          onChange={(e) => setBook({ ...book, body: e.target.value })}
        />

        <div>{errors}</div>

        <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
          <button
            className="btn btn-dark me-md-2 col-5"
            type="button"
            onClick={cancelCreate}
          >
            Cancel
          </button>
          <button className="btn btn-dark me-md-2 col-5" type="submit">
            Upload
          </button>
        </div>
      </BookForm>
    </Textile>
  );
};

export default CreateBook;
