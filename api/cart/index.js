// api/cart/[userId].js
import connectDB from "../../config/db";
import { Cart } from "../../models/user";
import Product from "../../models/Product";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const userId = req.query.id;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  await connectDB();

  if (req.method === "GET") {
    try {
      // Convert userId to ObjectId
      const cart = await Cart.findOne({
        userId: mongoose.Types.ObjectId(userId),
      }).populate("items.productId");

      // Check if the cart was found
      if (!cart) {
        return res
          .status(404)
          .json({ success: false, message: "Cart not found" });
      }

      const { items } = cart; // Destructure items for response
      res.status(200).json({ success: true, items });
    } catch (error) {
      console.error("Error retrieving cart:", error.message); // Log only the error message
      res
        .status(500)
        .json({ success: false, message: "Error retrieving cart" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
