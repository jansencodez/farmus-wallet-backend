// api/cart/[userId]/update.js
import connectDB from "../../../config/db";
import { Cart } from "../../../models/user";

export default async function handler(req, res) {
  const { id: userId } = req.query;
  const { itemId } = req.body;

  await connectDB();

  if (req.method === "PUT") {
    try {
      const { quantity } = req.body;
      const cart = await Cart.findOneAndUpdate(
        { userId, "items._id": itemId },
        { $set: { "items.$.quantity": quantity } },
        { new: true }
      );
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error updating item quantity", error });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
