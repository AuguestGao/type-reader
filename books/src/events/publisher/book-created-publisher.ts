import { IBookCreatedEvent, Publisher, Subjects } from "@type-reader/common";

export class BookCreatedPublisher extends Publisher<IBookCreatedEvent> {
  readonly subject = Subjects.BookCreated;
}
