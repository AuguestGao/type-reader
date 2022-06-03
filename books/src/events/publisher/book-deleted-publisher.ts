import { BookDeletedEvent, Publisher, Subjects } from "@type-reader/common";

export class BookDeletedPublisher extends Publisher<BookDeletedEvent> {
  readonly subject = Subjects.BookDeleted;
}
