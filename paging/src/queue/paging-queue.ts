import Queue from "bull";
import { PageData } from "@type-reader/common";

interface Payload {
  bookId: string;
  body: PageData[];
}

const pagingQueue = new Queue<Payload>("book-paging-queue", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

pagingQueue.process(async (job) => {
  // todo publishing pageing:completed event
  console.log(`JOB ${job.data.bookId} paging done.`);
});

export { pagingQueue };
