import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { AxiosRequestHeaders } from "axios";
import dayjs from "dayjs";

import buildClient from "../../api/build-client";
import { ButtonLink, Textile } from "../../components";
import { getDHMSString } from "../../utils/convert-seconds";
import { IRecordProps } from "../../types";
import { getCurrentUser } from "../../api/get-current-user";
import { useAuth } from "../../context/user-context";

import styles from "../../styles/Statistics.module.scss";

const StatsLatest = ({
  record,
  currentUser,
}: {
  record: IRecordProps;
  currentUser: string;
}) => {
  const { setCurrentUser } = useAuth();
  useEffect(() => {
    setCurrentUser!(currentUser);
  }, []);

  const { createdAt, accuracy, readInSec, totalEntry, wpm, netWpm, kpm } =
    record;
  const [parsedTime, setParsedTime] = useState("");

  useEffect(() => {
    setParsedTime(dayjs(createdAt).format("MMM D, YYYY h:mm a"));
  }, []);

  const formatNumber = (num: number, unit: string) => {
    if (Number.isNaN(num)) {
      return "N/a";
    }
    return `${num.toString()} ${unit}`;
  };

  return (
    <Textile>
      <h1>The Latest Performance</h1>
      <div className={styles.main}>
        {Object.keys(record).length === 0 ? (
          <p>It seems you don&apos;t have any record yet</p>
        ) : (
          <>
            <p className={styles.date}>{parsedTime}</p>
            <p>Total Key Entered: {formatNumber(totalEntry, "")}</p>
            <p>Time Spent: {getDHMSString(readInSec)}</p>
            <p>Accuracy: {formatNumber(accuracy, "%")}</p>
            <p>Speed: {formatNumber(wpm, "WPM")}</p>
            <p>Net Speed: {formatNumber(netWpm, "WPM")}</p>
            <p>Key Speed: {formatNumber(kpm, "KPM")}</p>
          </>
        )}
      </div>
      <div className={styles.backBtn}>
        <ButtonLink dest="/books" label="to Books" />
      </div>
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

    const record = await client.get("/api/stats/latest");
    return {
      props: {
        record: record.data,
        currentUser: currentUser.displayName,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default StatsLatest;
