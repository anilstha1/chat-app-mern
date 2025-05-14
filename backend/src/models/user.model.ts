import mongoose, {Document, Model} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

type UserDocument = Document & IUser & IUserMethods;

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    image: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {timestamps: true}
);

userSchema.methods.matchPassword = async function (
  this: UserDocument,
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (this: UserDocument, next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model<UserDocument>("User", userSchema);

export {UserDocument};
export default User;
