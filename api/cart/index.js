// api/cart/[userId].js
import connectDB from "../../config/db";
import { Cart } from "../../models/user";

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
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      res.status(200).json({ success: true, items: cart ? cart.items : [] });
    } catch (error) {
      console.error("Error retrieving cart:", error);
      res
        .status(500)
        .json({ success: false, message: "Error retrieving cart", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
