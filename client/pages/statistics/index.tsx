import { useEffect } from "react";
import type { GetServerSideProps } from "next";
import { AxiosRequestHeaders } from "axios";

import buildClient from "../../api/build-client";
import { ButtonLink, Textile } from "../../components";
import { getDHMSString } from "../../utils/convert-seconds";
import { getCurrentUser } from "../../api/get-current-user";
import { useAuth } from "../../context/user-context";

import styles from "../../styles/Statistics.module.scss";

interface IStatsProps {
  totalEntry: number;
  totalReadInSec: number;
}

const StatsOverall = ({
  stats,
  currentUser,
}: {
  stats: IStatsProps;
  currentUser: string;
}) => {
  const { setCurrentUser } = useAuth();
  useEffect(() => {
    setCurrentUser!(currentUser);
  }, []);
  return (
    <Textile>
      <h1 className={styles.title}>Totally,</h1>
      <div className={styles.main}>
        <p>Key Entered: {stats.totalEntry}</p>
        <p>Time Spent: {getDHMSString(stats.totalReadInSec)}</p>
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

    const stats = await client.get("/api/stats");
    return {
      props: {
        stats: stats.data,
        currentUser: currentUser.displayName,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default StatsOverall;
