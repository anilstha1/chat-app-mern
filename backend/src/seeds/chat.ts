import mongoose, {connect} from "mongoose";
import {Chat} from "../models/chat.model";
import {Message} from "../models/message.model";
import User from "../models/user.model";
import dotenv from "dotenv";
import connectDB from "../db";

dotenv.config();

const seedChats = async () => {
  try {
    console.log("Seeding chats...");
    // Connect to MongoDB
    connectDB();

    // Get existing users
    const users = await User.find({});
    if (users.length < 3) {
      console.log("Not enough users in database. Please seed users first.");
      process.exit(1);
    }

    // Create direct chats
    const directChat1 = await Chat.create({
      isGroupChat: false,
      users: [users[0]._id, users[1]._id],
    });

    const directChat2 = await Chat.create({
      isGroupChat: false,
      users: [users[0]._id, users[2]._id],
    });

    console.log("Chats seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding chats:", error);
    process.exit(1);
  }
};

seedChats();
