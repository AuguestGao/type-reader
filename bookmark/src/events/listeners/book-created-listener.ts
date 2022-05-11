import { IBookCreatedEvent, Subjects, Listener } from "@type-reader/common";
import { Message } from "node-nats-streaming";
import { Bookmark } from "../../model/bookmark";

import { queueGroupName } from "./queue-group-name";

export class BookCreatedListener extends Listener<IBookCreatedEvent> {
  readonly subject = Subjects.BookCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: IBookCreatedEvent["data"], msg: Message) {
    const { bookId, userId } = data;

    const bookmark = Bookmark.build({ bookId, userId });

    await bookmark.save();

    msg.ack();
  }
}
