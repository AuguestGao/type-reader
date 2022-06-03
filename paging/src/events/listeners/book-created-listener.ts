import { BookCreatedEvent, Subjects, Listener } from "@type-reader/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { pagingQueue } from "../../queue/paging-queue";

export class BookCreatedListener extends Listener<BookCreatedEvent> {
  readonly subject = Subjects.BookCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: BookCreatedEvent["data"], msg: Message) {
    const { bookId, body } = data;
    await pagingQueue.add({ bookId, body });

    msg.ack();
  }
}
