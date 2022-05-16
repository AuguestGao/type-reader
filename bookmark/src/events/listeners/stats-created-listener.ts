import {
  IStatsCreatedEvent,
  Subjects,
  Listener,
  NotFoundError,
} from "@type-reader/common";
import { Message } from "node-nats-streaming";
import { Bookmark } from "../../model/bookmark";

import { queueGroupName } from "./queue-group-name";

export class StatsCreatedListener extends Listener<IStatsCreatedEvent> {
  readonly subject = Subjects.StatsCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: IStatsCreatedEvent["data"], msg: Message) {
    const { bookId, userId, prevText, pageIndex, readInSec, progress } = data;

    const bookmark = await Bookmark.findOne({ bookId, userId });

    if (!bookmark) {
      throw new NotFoundError();
    }

    await bookmark.refresh(prevText, progress, pageIndex, readInSec);

    msg.ack();
  }
}
