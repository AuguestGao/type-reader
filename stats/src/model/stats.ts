import mongoose from "mongoose";
import { IRecordDoc, IRecordAttrs } from "./record";

interface IStatsAttrs {
  userId: string;
  record?: IRecordAttrs;
}

export interface IStatsDoc extends mongoose.Document {
  userId: string;
  totalReadInSec: number;
  totalEntry: number;
  records: IRecordDoc[];
}

interface IStatsModel extends mongoose.Model<IStatsDoc> {
  build(attrs: IStatsAttrs): IStatsDoc;
}

const StatsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    totalReadInSec: {
      type: Number,
      required: true,
      min: 0,
    },
    totalEntry: {
      type: Number,
      min: 0,
    },
    records: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Record",
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

StatsSchema.statics.build = (attrs: IStatsAttrs) => {
  return new Stats({
    userId: attrs.userId,
    totalReadInSec: 0,
    totalEntry: 0,
    records: [],
  });
};

const Stats = mongoose.model<IStatsDoc, IStatsModel>("Stats", StatsSchema);

export { Stats };
