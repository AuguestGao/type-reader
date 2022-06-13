import mongoose from "mongoose";
import { EntryState } from "@type-reader/common";

export interface Key {
  key: string;
  pressedKey: string;
  state: EntryState;
}

export interface IRecordAttrs {
  bookId: string;
  correctEntry: number;
  incorrectEntry: number;
  fixedEntry: number;
  readInSec: number;
  entryHistory: Key[];
}

export interface IRecordDoc extends mongoose.Document {
  bookId: string;
  createdAt: Date;
  updatedAt: Date;
  correctEntry: number;
  incorrectEntry: number;
  fixedEntry: number;
  readInSec: number;
  entryHistory: [
    {
      key: string;
      pressedKey: string;
      state: EntryState;
    }
  ];
  totalEntry: number;
  accuracy: number;
  wpm: number;
  netWpm: number;
  kpm: number;
}

interface IRecordModel extends mongoose.Model<IRecordDoc> {
  build(attrs: IRecordAttrs): IRecordDoc;
}

const RecordSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
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
    entryHistory: [
      {
        key: {
          type: String,
          required: true,
        },
        pressedKey: String,
        state: {
          type: String,
          enum: Object.values(EntryState),
          required: true,
        },
      },
    ],
    totalEntry: {
      type: Number,
      required: true,
      min: 0,
    },
    wpm: {
      type: Number,
      required: true,
    },
    netWpm: {
      type: Number,
      required: true,
    },
    kpm: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const calculateStats = (data: IRecordAttrs) => {
  const { correctEntry, incorrectEntry, fixedEntry, readInSec } = data;

  if (readInSec === 0) {
    return {
      totalEntry: 0,
      wpm: 0,
      netWpm: 0,
      kpm: 0,
      accuracy: 0,
    };
  }

  const readInMinute = readInSec / 60;

  const totalEntry = correctEntry + incorrectEntry;

  const accuracy = Math.round((correctEntry / totalEntry) * 100);

  const wpm = Math.round(totalEntry / 5 / readInMinute);

  const netWpm = Math.round(
    (totalEntry / 5 - (incorrectEntry - fixedEntry)) / readInMinute
  );

  const kpm = Math.round(totalEntry / readInMinute);

  return {
    totalEntry,
    accuracy,
    wpm,
    netWpm,
    kpm,
  };
};

RecordSchema.statics.build = (attrs: IRecordAttrs) => {
  const { totalEntry, wpm, netWpm, kpm, accuracy } = calculateStats(attrs);

  return new Record({
    bookId: attrs.bookId,
    correctEntry: attrs.correctEntry,
    incorrectEntry: attrs.incorrectEntry,
    fixedEntry: attrs.fixedEntry,
    readInSec: attrs.readInSec,
    entryHistory: attrs.entryHistory,
    totalEntry,
    accuracy,
    wpm,
    netWpm,
    kpm,
  });
};

const Record = mongoose.model<IRecordDoc, IRecordModel>("Record", RecordSchema);

export { Record };
