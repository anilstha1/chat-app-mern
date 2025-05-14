import User from "../models/user.model";
import {Chat} from "../models/chat.model";
import {Request, Response} from "express";
import {ApiResponse} from "..//utils/apiResponse";
import {ApiError} from "../utils/apiError";

export const getChats = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find({users: {$elemMatch: {$eq: req.user?._id}}})
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({updatedAt: -1});
    const results = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email image",
    });

    res
      .status(200)
      .json(new ApiResponse(200, results, "Chats fetched successfully"));
  } catch (error) {
    console.log("Error fetching chats:", error);
    throw new ApiError(500, "Internal server error");
  }
};

export const accessChat = async (req: Request, res: Response) => {
  const {userId} = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID not provided");
  }

  let chat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      {users: {$elemMatch: {$eq: req.user?._id}}},
      {users: {$elemMatch: {$eq: userId}}},
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  const result = await User.populate(chat, {
    path: "latestMessage.sender",
    select: "name email image",
  });

  if (chat) {
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Chat fetched successfully"));
  }

  const newChat = await Chat.create({
    isGroupChat: false,
    users: [req.user?._id, userId],
  });

  const fullChat = await Chat.findOne({_id: newChat._id}).populate(
    "users",
    "-password"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, fullChat, "New chat created successfully"));
};

export const createGroupChat = async (req: Request, res: Response) => {
  const {name, users} = req.body;

  if (!name || !users) {
    throw new ApiError(400, "Name and users are required");
  }

  if (users.length < 2) {
    throw new ApiError(400, "At least 2 users are required to create a group");
  }

  const parsedUsers = JSON.parse(users);
  parsedUsers.push(req.user?._id);

  const groupChat = await Chat.create({
    chatName: name,
    users: parsedUsers,
    isGroupChat: true,
    groupAdmin: req.user?._id,
  });

  const fullGroupChat = await Chat.findOne({_id: groupChat._id}).populate(
    "users",
    "-password"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, fullGroupChat, "Group chat created successfully")
    );
};

export const renameGroup = async (req: Request, res: Response) => {
  const {chatId, chatName} = req.body;

  if (!chatId || !chatName) {
    throw new ApiError(400, "Chat ID and chat name are required");
  }

  const chat = await Chat.findOne({_id: chatId, groupAdmin: req.user?._id});
  if (!chat) {
    throw new ApiError(403, "You are not authorized to rename this group");
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {chatName},
    {new: true}
  ).populate("users", "-password");
  return res
    .status(200)
    .json(new ApiResponse(200, updatedChat, "Group name updated successfully"));
};

export const addToGroup = async (req: Request, res: Response) => {
  const {chatId, userIds} = req.body;

  if (!chatId || !userIds) {
    throw new ApiError(400, "Chat ID and user ID are required");
  }

  const chat = await Chat.findOne({_id: chatId, groupAdmin: req.user?._id});
  if (!chat) {
    throw new ApiError(
      403,
      "You are not authorized to add users to this group"
    );
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {$addToSet: {users: {$each: userIds}}},
    {new: true}
  ).populate("users", "-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedChat, "User added to group successfully")
    );
};

export const removeFromGroup = async (req: Request, res: Response) => {
  const {chatId, userId} = req.body;

  if (!chatId || !userId) {
    throw new ApiError(400, "Chat ID and user ID are required");
  }

  const chat = await Chat.findOne({_id: chatId, groupAdmin: req.user?._id});
  if (!chat) {
    throw new ApiError(
      403,
      "You are not authorized to remove users from this group"
    );
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {$pull: {users: userId}},
    {new: true}
  ).populate("users", "-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedChat, "User removed from group successfully")
    );
};

export const leaveFromGroup = async (req: Request, res: Response) => {
  const {chatId} = req.body;

  if (!chatId) {
    throw new ApiError(400, "Chat ID and user ID are required");
  }

  const chat = await Chat.findOne({
    _id: chatId,
    users: {$elemMatch: {$eq: req.user?._id}},
  });
  if (!chat) {
    throw new ApiError(400, "Chat not found");
  }

  await Chat.findByIdAndUpdate(chatId, {
    $pull: {users: req.user?._id},
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User removed from group successfully"));
};

export const deleteGroup = async (req: Request, res: Response) => {
  const {chatId} = req.params;

  if (!chatId) {
    throw new ApiError(400, "Chat ID is required");
  }

  const chat = await Chat.findOne({
    _id: chatId,
    groupAdmin: {$eq: req.user?._id},
  });
  if (!chat) {
    throw new ApiError(403, "You are not authorized to delete this group");
  }

  await Chat.findByIdAndDelete(chatId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Group deleted successfully"));
};
