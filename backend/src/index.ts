import dotenv from "dotenv";
import connectDB from "./db/index";
import {httpServer} from "./app";
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    httpServer.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
