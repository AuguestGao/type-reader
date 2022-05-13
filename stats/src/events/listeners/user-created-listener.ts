import { IUserCreatedEvent, Subjects, Listener } from "@type-reader/common";
import { Message } from "node-nats-streaming";
import { Stats } from "../../model/stats";

import { queueGroupName } from "./queue-group-name";

export class UserCreatedListener extends Listener<IUserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: IUserCreatedEvent["data"], msg: Message) {
    const { userId } = data;

    const attrs = {
      userId,
      bookId: "",
      correctEntry: 0,
      incorrectEntry: 0,
      fixedEntry: 0,
      usedSec: 0,
    };

    const stats = Stats.build(attrs);

    await stats.save();

    msg.ack();
  }
}
