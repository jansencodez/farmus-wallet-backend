const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const TransactionSchema = new mongoose.Schema({
  amount: { type: mongoose.Schema.Types.Decimal128, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 0, // Ensure quantity cannot be negative
      },
      price: {
        type: mongoose.Schema.Types.Decimal128,
        required: true, // Price is required for each item
      },
    },
  ],
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profilePicture: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  walletBalance: { type: mongoose.Schema.Types.Decimal128, default: 0.0 },
  transactionHistory: [TransactionSchema],
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" }, // Reference to a single cart
});

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create models
const User = mongoose.model("User", UserSchema);
const Cart = mongoose.model("Cart", CartSchema);
const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = { User, Cart, Transaction };
