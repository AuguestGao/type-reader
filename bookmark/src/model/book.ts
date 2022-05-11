import mongoose from "mongoose";

interface IBookAttrs {
  id: string;
}

export interface IBookDoc extends mongoose.Document {
  id: string;
}

interface IBookModel extends mongoose.Model<IBookDoc> {
  build(attrs: IBookAttrs): IBookDoc;
}

const bookSchema = new mongoose.Schema(
  {
    id: {
      type: String,
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

bookSchema.statics.build = (attrs: IBookAttrs) => {
  return new Book(attrs);
};

const Book = mongoose.model<IBookDoc, IBookModel>("Book", bookSchema);

export { Book };
