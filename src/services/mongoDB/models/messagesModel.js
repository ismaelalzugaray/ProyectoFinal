import mongoose from "mongoose";

const collectionName = "messages";

const messagesSchema = new mongoose.Schema({
  user: { type: String, required: true },

  message: { type: String, required: true },
});

const messageModel = new mongoose.model(collectionName, messagesSchema);

export default messageModel;
