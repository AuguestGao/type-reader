import mongoose from "mongoose";

interface BookAttrs {
  title: string;
  body: string;
  userId: string;
  author: string;
}

interface BookDoc extends mongoose.Document {
  title: string;
  body: string;
  userId: string;
  author: string;
}

interface BookModel extends mongoose.Model<BookDoc> {
  build(attrs: BookAttrs): BookDoc;
}

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      enum: Object.values(BookStatus),
      required: true,
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
