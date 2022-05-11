import mongoose from "mongoose";

interface IBookmarkAttrs {
  bookId: string;
  userId: string;
}

interface IBookmarkDoc extends mongoose.Document {
  bookId: string;
  userId: string;
  current: {
    pageIndex: number;
  };
  prevText: string;
  totalReadTime: number;
  progress: number;
  refresh(prevText: string, pageIndex: number, readTime: number): Promise<void>;
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
    current: {
      pageIndex: {
        type: String,
        required: true,
      },
    },
    prevText: String,
    totalReadTime: Number,
    progress: Number,
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

bookmarkSchema.statics.build = (attrs: IBookmarkAttrs) => {
  return new Bookmark({
    ...attrs,
    current: {
      pageIndex: 0,
    },
    prevText: "",
    totalReadTime: 0,
    progress: 0,
  });
};

bookmarkSchema.methods.refresh = async function (
  prevText: string,
  pageIndex: number,
  readTime: number
) {
  const bookmark = this as IBookmarkDoc;

  bookmark.prevText = prevText;
  bookmark.current.pageIndex = pageIndex;
  bookmark.totalReadTime += readTime;

  await bookmark.save();
};

const Bookmark = mongoose.model<IBookmarkDoc, IBookmarkModel>(
  "Bookmark",
  bookmarkSchema
);

export { Bookmark };
