import mongoose from "mongoose";
import { BookStatus, BookBody } from "@type-reader/common";

interface BookAttrs {
  userId: string;
  title: string;
  author: string;
  body: string;
}

interface BookDoc extends mongoose.Document {
  userId: string;
  title: string;
  author: string;
  totalPages: number;
  body: BookBody[];
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface BookModel extends mongoose.Model<BookDoc> {
  build(attrs: BookAttrs): BookDoc;
}

const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    body: [
      {
        pageIndex: {
          type: Number,
          required: true,
        },
        pageContent: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],
    status: {
      type: String,
      enum: Object.values(BookStatus),
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

bookSchema.statics.build = (attrs: BookAttrs) => {
  const extendedAttrs = {
    ...attrs,
    totalPages: 1,
    body: [
      {
        pageIndex: 0,
        pageContent: [attrs.body],
      },
    ],
    status: BookStatus.Created,
  };
  return new Book(extendedAttrs);
};

const Book = mongoose.model<BookDoc, BookModel>("Book", bookSchema);

export { Book };
