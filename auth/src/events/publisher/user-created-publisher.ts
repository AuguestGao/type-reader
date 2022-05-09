import { Publisher, Subjects, IUserCreatedEvent } from "@type-reader/common";

export class UserCreatedPublisher extends Publisher<IUserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
}
