import { UserCreatedEvent, Subjects, Listener } from "@type-reader/common";
import { Message } from "node-nats-streaming";
import { Stats } from "../../model/stats";

import { queueGroupName } from "./queue-group-name";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent["data"], msg: Message) {
    const { userId } = data;

    const attrs = {
      userId,
      readInSec: 0,
      totalEntry: 0,
    };

    const stats = Stats.build(attrs);

    await stats.save();

    msg.ack();
  }
}
