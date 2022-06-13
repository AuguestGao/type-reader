import { BookBody } from "@type-reader/common";
import Queue from "bull";

import { natsWrapper } from "../nats-wrapper";
import { PagingCompletedPublisher } from "../events/publishers/paging-completed-publisher";
import { pageBook } from "../utils/page-book";

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

  body = pageBook(body);

  new PagingCompletedPublisher(natsWrapper.client).publish({
    bookId: job.data.bookId,
    body,
  });
});

export { pagingQueue };
