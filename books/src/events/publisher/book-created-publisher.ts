import { BookCreatedEvent, Publisher, Subjects } from "@type-reader/common";

export class BookCreatedPublisher extends Publisher<BookCreatedEvent> {
  readonly subject = Subjects.BookCreated;
}
