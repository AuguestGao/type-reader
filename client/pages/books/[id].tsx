import { FormEvent, useEffect } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { AxiosRequestHeaders } from "axios";

import useRequest from "../../hooks/use-request";
import buildClient from "../../api/build-client";
import { useAuth } from "../../context/user-context";
import Textile from "../../components/Textile";

import styles from "../../styles/Book.module.scss";

interface OneBookProps {
  id: string;
  title: string;
  author: string;
}

const OneBook = ({ info }: { info: OneBookProps | null }) => {
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log(info);
    if (!currentUser) {
      router.push("/books");
    }

    if (!info) {
      router.push("/books");
    }
  }, [currentUser]);

  const { doRequest, errors } = useRequest({
    url: `/api/books/${encodeURIComponent(info!.id)}`,
    method: "delete",
    body: {},

    onSuccess: () => {
      router.push("/books");
    },
  });

  const startBook = (e: FormEvent) => {
    e.preventDefault();

    console.log("start reading clicked");
  };

  const deleteBook = async (e: FormEvent) => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <Textile>
      <h1>{info!.title}</h1>
      <address className={styles.author}>Written by {info!.author}</address>

      <div>{errors}</div>

      <div className="d-grid gap-2 col-6 mx-auto">
        <button type="button" className="btn btn-dark" onClick={startBook}>
          Start reading
        </button>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={deleteBook}
        >
          Delete this book
        </button>
      </div>
    </Textile>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = context.req.headers as AxiosRequestHeaders;
  const client = buildClient(headers);

  if (!context.params?.id) {
    return {
      props: {
        info: null,
      },
    };
  }

  const id = context.params.id as string;

  try {
    const { data } = await client.get(`/api/books/${encodeURIComponent(id)}`);

    return {
      props: {
        info: data as OneBookProps,
      },
    };
  } catch (err) {
    // ! delete before deploy
    console.log(err);
  }

  return {
    props: {
      info: null,
    },
  };
};

export default OneBook;
