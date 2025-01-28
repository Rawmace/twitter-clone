import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      requird: true,
      minLength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    //each user will be having followers so array
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId, //
        ref: "User",
        default: [], // a person will have 0 folowers when signed up
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [], // a person will have 0 folowing when signed up
      },
    ],
    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
); //member since july 2021 createdAt:

const User = mongoose.model("User", userSchema);
export default User;
