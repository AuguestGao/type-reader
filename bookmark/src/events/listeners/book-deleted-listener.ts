import { BookDeletedEvent, Subjects, Listener } from "@type-reader/common";
import { Message } from "node-nats-streaming";
import { Bookmark } from "../../model/bookmark";

import { queueGroupName } from "./queue-group-name";

export class BookDeletedListener extends Listener<BookDeletedEvent> {
  readonly subject = Subjects.BookDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: BookDeletedEvent["data"], msg: Message) {
    const { bookId, userId } = data;

    await Bookmark.findOneAndDelete({ bookId, userId });

    msg.ack();
  }
}
