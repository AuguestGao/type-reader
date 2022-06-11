import Queue from "bull";
import { PagingCompletedPublisher } from "../events/publishers/paging-completed-publisher";
import { BookBody } from "@type-reader/common";
import { pageBook } from "../utils/page-book";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  bookId: string;
  body: BookBody[];
}

const pagingQueue = new Queue<Payload>("book-paging-queue", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

pagingQueue.process(async (job) => {
  let { body } = job.data;

  console.log("body before", body);

  body = pageBook(body);

  console.log("body after", body);

  new PagingCompletedPublisher(natsWrapper.client).publish({
    bookId: job.data.bookId,
    body,
  });
});

export { pagingQueue };
