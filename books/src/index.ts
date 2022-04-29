import { app } from "./app";

const start = () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  app.listen(3000, () => {
    console.log("Books is listensing at port 3000!!");
  });
};

start();
