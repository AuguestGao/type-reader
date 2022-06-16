import type { GetServerSideProps } from "next";
import { AxiosRequestHeaders } from "axios";
import Link from "next/link";

import buildClient from "../../api/build-client";
import { Textile } from "../../components";
import { getDHMSString } from "../../utils/convert-seconds";

import styles from "../../styles/Statistics.module.scss";
import { redirectIfNotAuth } from "../../api/redirect-if-not-auth";

interface IStatsProps {
  totalEntry: number;
  totalReadInSec: number;
}

const StatsOverall = ({ stats }: { stats: IStatsProps }) => {
  // todo delete below
  const totalEntry = 500000;
  const totalReadInSec = 15028;
  // todo end

  return (
    <Textile>
      <h1 className={styles.title}>Total</h1>
      <div className={styles.main}>
        <p>Key Entered: {stats.totalEntry}</p>
        <p>Time Spent: {getDHMSString(stats.totalReadInSec)}</p>
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
    const stats = await client.get("/api/stats");
    return {
      props: {
        stats: stats.data,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default StatsOverall;
