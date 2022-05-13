import { Publisher, Subjects, IStatsCreatedEvent } from "@type-reader/common";
export class StatsCreatedPublisher extends Publisher<IStatsCreatedEvent> {
  readonly subject = Subjects.StatsCreated;
}
