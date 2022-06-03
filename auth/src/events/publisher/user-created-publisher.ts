import { Publisher, Subjects, UserCreatedEvent } from "@type-reader/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
}
