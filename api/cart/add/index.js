import connectDB from "../../../config/db";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
  const { userId } = req.query;

  await connectDB();

  if (req.method === "POST") {
    try {
      const { productId, quantity } = req.body;

      // Find the cart for the user
      let cart = await Cart.findOne({ userId });

      // If no cart exists for the user, create one
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      // Add the new item to the cart
      cart.items.push({ productId, quantity });

      // Save the cart back to the database
      await cart.save();

      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error adding item to cart", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
