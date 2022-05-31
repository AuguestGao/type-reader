import {
  IBookPagedEvent,
  Subjects,
  Listener,
  BookStatus,
} from "@type-reader/common";
import { Message } from "node-nats-streaming";
import { Book } from "../../model/book";

export class BookPagedListener extends Listener<IBookPagedEvent> {
  readonly subject = Subjects.BookPaged;
  queueGroupName = "books-service";

  async onMessage(data: IBookPagedEvent["data"], msg: Message) {
    const { bookId, body } = data;

    await Book.findOneAndUpdate(
      { bookId },
      { body, status: BookStatus.Paged, totalPages: body.length }
    );

    msg.ack();
  }
}
