import { useEffect, useState, MouseEvent, ReactNode } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { AxiosRequestHeaders } from "axios";
import moment from "moment";

import buildClient from "../../api/build-client";
import { Textile } from "../../components";
import { getDHMSString } from "../../utils/convert-seconds";
import { IRecordProps } from "../../types";

const StatsLatest = ({ record }: { record: IRecordProps }) => {
  const router = useRouter();

  useEffect(() => {
    console.log(record);
  }, []);

  const renderRecord = () => {
    const { createdAt, accuracy, readInSec, totalEntry, wpm, netWpm, kpm } =
      record;
    const parsedTime = moment(createdAt).format("MMM D, YYYY h:mm a");

    return (
      <>
        <h1>Latest statistics</h1>
        <p>on {parsedTime}</p>
        <p>Total Entry: {totalEntry}</p>
        <p>Time used: {getDHMSString(readInSec)}</p>
        <p>Accuracy: {accuracy}%</p>
        <p>Speed: {wpm} WPM</p>
        <p>Net Speed: {netWpm} WPM</p>
        <p>Key Speed: {kpm} KPM</p>
      </>
    );
  };

  return (
    <Textile>
      {Object.keys(record).length === 0 ? <p>No record yet</p> : renderRecord()}
    </Textile>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = context.req.headers as AxiosRequestHeaders;
  const client = buildClient(headers);

  const record = await client.get("/api/stats/latest");

  if (record.status !== 200) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      record: record.data,
    },
  };
};

export default StatsLatest;
