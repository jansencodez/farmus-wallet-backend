// api/cart/[userId]/add.js
import connectDB from "../../../config/db";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
  const { userId } = req.query;

  await connectDB();

  if (req.method === "POST") {
    try {
      const { productId, quantity } = req.body;
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { $addToSet: { items: { productId, quantity } } },
        { new: true, upsert: true }
      );
      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error adding item to cart", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
