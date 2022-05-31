import mongoose from "mongoose";

interface IBookmarkAttrs {
  bookId: string;
  userId: string;
}

interface IBookmarkDoc extends mongoose.Document {
  bookId: string;
  userId: string;
  totalSecOnBook: number;
  pageIndex: number;
  cursorIndex: number;
  prevText: string;
}

interface IBookmarkModel extends mongoose.Model<IBookmarkDoc> {
  build(attrs: IBookmarkAttrs): IBookmarkDoc;
}

const bookmarkSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    pageIndex: {
      type: Number,
      required: true,
    },
    cursorIndex: {
      type: Number,
      required: true,
    },
    totalSecOnBook: {
      type: Number,
      required: true,
    },
    prevText: {
      type: String,
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

bookmarkSchema.statics.build = (attrs: IBookmarkAttrs) => {
  const { userId, bookId } = attrs;
  return new Bookmark({
    userId,
    bookId,
    totalSecOnBook: 0,
    pageIndex: 0,
    cursorIndex: 0,
    prevText: "n/a",
  });
};

const Bookmark = mongoose.model<IBookmarkDoc, IBookmarkModel>(
  "Bookmark",
  bookmarkSchema
);

export { Bookmark };
