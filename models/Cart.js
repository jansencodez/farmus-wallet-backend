const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  Items: {
    productId: { type: mongoose.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, required: true, default: 1 },
  },
});

module.exports = mongoose.model("Cart", cartSchema);
