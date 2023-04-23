import mongoose from "mongoose";
import logger from "./logger.js";

const db = async () => {
  // const dbURI =
  //   "mongodb+srv://EmployApp:employAppPassword@employappdb.zxgzkwr.mongodb.net/?retryWrites=true&w=majority";
  const dbURI = "mongodb://127.0.0.1:27017/employ_ng";
  try {
    await mongoose.connect(dbURI);
    logger.info(`DB connected`);
  } catch (error) {
    logger.error(`Could not connect to DB`);
  }
};

export default db;
