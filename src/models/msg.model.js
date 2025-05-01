import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      text: {
        type: String,
      },
      image: {
        type: String,
      },
      vedio: {
        type: String,
      },
      emoji: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Message = new mongoose.model("Message",messageSchema);
export default Message;