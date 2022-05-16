import mongoose from "mongoose";

interface IStatsAttrs {
  userId: string;
  bookId: string;
  correctEntry: number;
  incorrectEntry: number;
  fixedEntry: number;
  readInSec: number;
}

export interface IStatsDoc extends mongoose.Document {
  userId: string;
  bookId: string;
  timestamp: Date;
  correctEntry: number;
  incorrectEntry: number;
  fixedEntry: number;
  readInSec: number;
  totalEntry: number;
  WPM: number; // words per minutes
  netWPM: number; // net words per minutes
  KPM: number; // keys per minutes
  accuracy: number; // in %
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
    bookId: {
      type: String,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    correctEntry: {
      type: Number,
      required: true,
      min: 0,
    },
    incorrectEntry: {
      type: Number,
      required: true,
      min: 0,
    },
    fixedEntry: {
      type: Number,
      required: true,
      min: 0,
    },
    readInSec: {
      type: Number,
      required: true,
      min: 0,
    },
    totalEntry: {
      type: Number,
      min: 0,
    },
    WPM: {
      type: Number,
      min: 0,
    },
    netWPM: {
      type: Number,
      min: 0,
    },
    KPM: {
      type: Number,
      min: 0,
    },
    accuracy: {
      type: Number,
      min: 0,
    },
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

const calculateStats = (data: IStatsAttrs) => {
  const { correctEntry, incorrectEntry, fixedEntry, readInSec } = data;

  if (readInSec === 0) {
    return {
      totalEntry: 0,
      WPM: 0,
      netWPM: 0,
      KPM: 0,
      accuracy: 0,
    };
  }

  const readInMinute = readInSec / 60;

  const totalEntry = correctEntry + incorrectEntry;

  const WPM = Math.round(totalEntry / 5 / readInMinute);

  const netWPM = Math.round(
    (totalEntry / 5 - (incorrectEntry - fixedEntry)) / readInMinute
  );

  const KPM = Math.round(totalEntry / readInMinute);

  const accuracy = Math.round((correctEntry / totalEntry) * 100);

  return {
    totalEntry,
    WPM,
    netWPM,
    KPM,
    accuracy,
  };
};

StatsSchema.statics.build = (attrs: IStatsAttrs) => {
  const { totalEntry, WPM, netWPM, KPM, accuracy } = calculateStats(attrs);

  return new Stats({
    userId: attrs.userId,
    bookId: attrs.bookId,
    timestamp: new Date(),
    correctEntry: attrs.correctEntry,
    incorrectEntry: attrs.incorrectEntry,
    fixedEntry: attrs.fixedEntry,
    readInSec: attrs.readInSec,
    totalEntry,
    WPM,
    netWPM,
    KPM,
    accuracy,
  });
};

const Stats = mongoose.model<IStatsDoc, IStatsModel>("Stats", StatsSchema);

export { Stats };
