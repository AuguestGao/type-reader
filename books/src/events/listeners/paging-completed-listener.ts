import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import {
  PagingCompletedEvent,
  Subjects,
  Listener,
  BookStatus,
  NotFoundError,
} from "@type-reader/common";
import { Book } from "../../model/book";

export class PagingCompletedListener extends Listener<PagingCompletedEvent> {
  readonly subject = Subjects.PagingCompleted;
  queueGroupName = queueGroupName;

  async onMessage(data: PagingCompletedEvent["data"], msg: Message) {
    const { bookId, body } = data;

    const book = await Book.findById(bookId);

    if (!book) {
      throw new NotFoundError();
    }

    book.set({
      body,
      status: BookStatus.Paged,
      totalPages: body.length,
    });

    await book.save();

    msg.ack();
  }
}
