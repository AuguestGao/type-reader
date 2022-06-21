import mongoose from "mongoose";
import { EntryState, PageHistory } from "@type-reader/common";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";

declare global {
  function getSignIn(): {
    userId: string;
    cookie: string[];
  };
  function getBookId(): string;
  function getPageHistory(
    numCorrect: number,
    numIncorrect: number,
    numFixed: number
  ): PageHistory;
}

jest.mock("../nats-wrapper.ts");
jest.setTimeout(15000);

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "1234";

  mongo = new MongoMemoryServer();

  await mongo.start();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.getSignIn = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    displayName: "john",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJson = JSON.stringify(session);

  const base64 = Buffer.from(sessionJson).toString("base64");

  // console.log(base64);

  return { userId: payload.id, cookie: [`session=${base64}`] };
};

global.getBookId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};

global.getPageHistory = (
  numCorrect: number,
  numIncorrect: number,
  numFixed: number
): PageHistory => {
  const pageHistory: PageHistory = {};
  let pageIndex = 0;

  if (numCorrect) {
    pageHistory[pageIndex.toString()] = {
      pageIndex,
      cursorIndex: "0,1",
      totalParagraphs: 2,
      paragraphs: [
        {
          paragraphIndex: 0,
          paragraphContent: Array.from({ length: numCorrect }, () => ({
            charIndex: "0,0",
            char: "a",
            pressedKey: "a",
            state: EntryState.Correct,
          })),
          totalEntries: numCorrect,
        },
        {
          paragraphIndex: 0,
          paragraphContent: Array.from({ length: numCorrect }, () => ({
            charIndex: "0,0",
            char: "a",
            pressedKey: "a",
            state: EntryState.Correct,
          })),
          totalEntries: numCorrect,
        },
      ],
    };

    pageIndex += 1;
  }

  if (numIncorrect) {
    pageHistory[pageIndex.toString()] = {
      pageIndex,
      cursorIndex: "0,2",
      totalParagraphs: 1,
      paragraphs: [
        {
          paragraphIndex: 0,
          paragraphContent: Array.from({ length: numIncorrect }, () => ({
            charIndex: "0,1",
            char: "a",
            pressedKey: "a",
            state: EntryState.Incorrect,
          })),
          totalEntries: numIncorrect,
        },
      ],
    };

    pageIndex += 1;
  }

  if (numFixed) {
    pageHistory[pageIndex.toString()] = {
      pageIndex,
      cursorIndex: "0,3",
      totalParagraphs: 1,
      paragraphs: [
        {
          paragraphIndex: 0,
          paragraphContent: Array.from({ length: numFixed }, () => ({
            charIndex: "0,2",
            char: "a",
            pressedKey: "a",
            state: EntryState.Fixed,
          })),
          totalEntries: numFixed,
        },
      ],
    };
  }

  return pageHistory;
};
