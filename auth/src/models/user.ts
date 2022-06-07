import mongoose from "mongoose";
import { Hash } from "../utils/hash";

interface UserAttrs {
  displayName: string;
  email: string;
  password: string;
  question: string;
  answer: string;
}

interface UserDoc extends mongoose.Document {
  displayName: string;
  email: string;
  password: string;
  question: string;
  answer: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true, min: 3 },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 6 },
    question: { type: String, required: true, min: 3 },
    answer: { type: String, required: true, min: 3 },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        delete ret.answer;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await Hash.toHash(this.get("password"));
    this.set("password", hashedPassword);
  }
  if (this.isModified("answer")) {
    const hashedAnswer = await Hash.toHash(this.get("answer"));
    this.set("answer", hashedAnswer);
  }

  next();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
