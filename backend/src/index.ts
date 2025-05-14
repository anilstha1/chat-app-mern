import dotenv from "dotenv";
import connectDB from "./db/index";
import {app, io} from "./app";
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
    const SOCKET_PORT = process.env.SOCKET_PORT || 8001;
    io.listen(Number(SOCKET_PORT));
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
