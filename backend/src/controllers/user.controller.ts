import {Request, Response} from "express";
import User from "../models/user.model";
import {generateToken} from "../utils/generateToken";
import {ApiResponse} from "../utils/apiResponse";
import {ApiError} from "../utils/apiError";
import {uploadToCloudinary} from "../utils/uploadToCloudinary";

export const getAllUsers = async (req: Request, res: Response) => {
  const keyword = req.query.search
    ? {
        $or: [
          {name: {$regex: req.query.search, $options: "i"}},
          {email: {$regex: req.query.search, $options: "i"}},
        ],
      }
    : {};
  const users = await User.find(keyword)
    .find({_id: {$ne: req.user?._id}})
    .select("-password");

  res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
};

export const createUser = async (req: Request, res: Response) => {
  const {name, email, password} = req.body;

  const image = req.file;
  let imageUrl = "";
  if (image) {
    try {
      const cloudinaryResult: any = await uploadToCloudinary(image);
      imageUrl = cloudinaryResult.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new ApiError(500, "Error uploading image");
    }
  }

  const userExists = await User.findOne({email});
  if (userExists) {
    throw new ApiError(400, "User already exists");
  }

  const newUser = new User({
    name,
    email,
    password,
    image: imageUrl,
  });
  await newUser.save();

  const userResponse = {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    image: newUser.image,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };

  res
    .status(201)
    .json(new ApiResponse(201, userResponse, "User created successfully"));
};

export const loginUser = async (req: Request, res: Response) => {
  const {email, password} = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({email});
  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid email or password");
  }

  const token = generateToken(user._id);

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token,
  };

  res
    .status(200)
    .json(new ApiResponse(200, userResponse, "User logged in successfully"));
};
