import {Message} from "../models/message.model";
import {Chat} from "../models/chat.model";
import dotenv from "dotenv";
import connectDB from "../db";

dotenv.config();

const sampleMessages = [
  "Hey, how are you?",
  "I'm good, thanks! How about you?",
  "Just finished working on the project",
  "Can we schedule a meeting tomorrow?",
  "Sure, what time works for you?",
  "Let's meet at 2 PM",
  "Great idea!",
  "I'll send you the details later",
  "Thanks for your help!",
  "No problem at all",
];

const seedMessages = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    console.log("Seeding messages...");
    // Get all chats
    const chats = await Chat.find();
    if (chats.length === 0) {
      console.log("No chats found. Please seed chats first.");
      process.exit(1);
    }

    // Create messages for each chat
    for (const chat of chats) {
      const numMessages = Math.floor(Math.random() * 5) + 3; // 3-7 messages per chat

      for (let i = 0; i < numMessages; i++) {
        const sender =
          chat.users[Math.floor(Math.random() * chat.users.length)];
        const messageContent =
          sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

        const message = await Message.create({
          sender: sender._id,
          content: messageContent,
          chat: chat._id,
          readBy: [sender._id],
        });

        // Update chat's latest message
        await Chat.findByIdAndUpdate(chat._id, {
          latestMessage: message._id,
        });
      }
    }

    console.log("Messages seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding messages:", error);
    process.exit(1);
  }
};

seedMessages();
