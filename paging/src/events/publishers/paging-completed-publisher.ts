import { PagingCompletedEvent, Publisher, Subjects } from "@type-reader/common";

export class PagingCompletedPublisher extends Publisher<PagingCompletedEvent> {
  readonly subject = Subjects.PagingCompleted;
}
