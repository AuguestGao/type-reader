import { IBookDeletedEvent, Publisher, Subjects } from "@type-reader/common";

export class BookDeletedPublisher extends Publisher<IBookDeletedEvent> {
  readonly subject = Subjects.BookDeleted;
}
