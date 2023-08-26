import mongoose from "mongoose";

const collectionName = "users";

const usersSchema = new mongoose.Schema({
  firstName: { type: String, required: true },

  lastName: { type: String, required: true },

  fullName: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  age: { type: Number, required: true },

  password: { type: String, required: true },

  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },

  rol: { type: String, default: "user" },

  loggedBy: { type: String, default: "app" },

  documents: {
    type: [
      {
        name: { type: String },
        reference: { type: String },
      },
    ],
    default: [],
  },

  lastConnection: { type: String, default: "" },
});

usersSchema.pre("findOne", function () {
  this.populate("cart");
});

const userModel = new mongoose.model(collectionName, usersSchema);

export default userModel;
