import { Publisher, Subjects, StatsUpdatedEvent } from "@type-reader/common";
export class StatsUpdatedPublisher extends Publisher<StatsUpdatedEvent> {
  readonly subject = Subjects.StatsUpdated;
}
