// api/cart/[userId]/remove.js
import connectDB from "../../../config/db";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
  const { userId } = req.query;
  const { itemId } = req.body;

  await connectDB();

  if (req.method === "DELETE") {
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { _id: itemId } } },
        { new: true }
      );
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error removing item from cart", error });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
