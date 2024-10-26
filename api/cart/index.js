// api/cart/[userId].js
import connectDB from "../../config/db";
import { Cart } from "../../models/user";
import Product from "../../models/Product";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { id: userId } = req.query;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing User ID" });
  }

  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Database connection failed" });
  }

  if (req.method === "GET") {
    try {
      // Convert userId to ObjectId for the query
      const cart = await Cart.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      }).populate("items.productId");

      if (!cart) {
        return res
          .status(404)
          .json({ success: false, message: "Cart not found" });
      }

      const { items } = cart;
      res.status(200).json({ success: true, items });
    } catch (error) {
      console.error("Error retrieving cart:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Error retrieving cart" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
