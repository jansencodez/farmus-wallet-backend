// api/cart/[userId].js
import connectDB from "../../config/db";
import { Cart } from "../../models/user";

export default async function handler(req, res) {
  const { id: userId } = req.query;

  await connectDB();

  if (req.method === "GET") {
    try {
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      res.status(200).json(cart || { items: [] });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving cart", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
