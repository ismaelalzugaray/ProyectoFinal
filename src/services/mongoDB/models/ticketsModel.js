import mongoose from "mongoose";

const collectionName = "tickets";

const ticketsSchema = new mongoose.Schema({
  code: { type: String, unique: true },

  purchaseDateTime: { type: Date, default: Date.now },

  amount: { type: Number, required: true },

  purchaser: { type: String, required: true },
});

const ticketModel = mongoose.model(collectionName, ticketsSchema);

export default ticketModel;
