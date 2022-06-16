import type { GetServerSideProps } from "next";
import Link from "next/link";
import { AxiosError, AxiosRequestHeaders } from "axios";
import moment from "moment";

import buildClient from "../../api/build-client";
import { Textile } from "../../components";
import { getDHMSString } from "../../utils/convert-seconds";
import { IRecordProps } from "../../types";

import styles from "../../styles/Statistics.module.scss";
import { redirectIfNotAuth } from "../../api/redirect-if-not-auth";

const StatsLatest = ({ record }: { record: IRecordProps }) => {
  const renderRecord = () => {
    const { createdAt, accuracy, readInSec, totalEntry, wpm, netWpm, kpm } =
      record;
    const parsedTime = moment(createdAt).format("MMM D, YYYY h:mm a");

    return (
      <>
        <p className={styles.date}>{parsedTime}</p>
        <p>Total Key Entered: {totalEntry}</p>
        <p>Time Spent: {getDHMSString(readInSec)}</p>
        <p>Accuracy: {accuracy}%</p>
        <p>Speed: {wpm} WPM</p>
        <p>Net Speed: {netWpm} WPM</p>
        <p>Key Speed: {kpm} KPM</p>
      </>
    );
  };

  return (
    <Textile>
      <h1>The Latest Performance</h1>
      <div className={styles.main}>
        {Object.keys(record).length === 0 ? (
          <p>It seems you don&apos;t have any record yet</p>
        ) : (
          renderRecord()
        )}
      </div>
      <div className={styles.backBtn}>
        <Link href="/books" passHref>
          <a className="btn btn-primary" role="button" aria-disabled="true">
            Back to Books
          </a>
        </Link>
      </div>
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
    const record = await client.get("/api/stats/latest");
    return {
      props: {
        record: record.data,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default StatsLatest;
