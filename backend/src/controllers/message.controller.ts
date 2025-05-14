import {Request, Response} from "express";
import {Message} from "../models/message.model";
import {ApiResponse} from "../utils/apiResponse";
import {ApiError} from "../utils/apiError";
import {Chat} from "../models/chat.model";

export const getAllMessages = async (req: Request, res: Response) => {
  const {chatId} = req.params;

  if (!chatId) {
    throw new ApiError(400, "Chat ID is required");
  }

  const messages = await Message.find({chat: chatId})
    .populate("sender", "name email image")
    .populate("chat");
  if (!messages) {
    throw new ApiError(404, "Messages not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched successfully"));
};

export const sendMessage = async (req: Request, res: Response) => {
  const {content, chatId} = req.body;

  if (!content || !chatId) {
    throw new ApiError(400, "Content and Chat ID are required");
  }

  const message = await Message.create({
    sender: req.user?._id,
    content,
    chat: chatId,
  });

  const fullMessage = await message.populate("sender", "name email image");
  await fullMessage.populate("chat");
  await fullMessage.populate("chat.users", "name email image");

  await Chat.findByIdAndUpdate(chatId, {latestMessage: message});

  res
    .status(201)
    .json(new ApiResponse(201, fullMessage, "Message sent successfully"));
};
