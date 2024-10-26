import connectDB from "../../../config/db";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
  const { userId } = req.query;

  await connectDB();

  if (req.method === "POST") {
    try {
      const { productId, quantity } = req.body;
      console.log("Incoming data:", { productId, quantity }); // Log incoming data

      // Find the cart for the user
      let cart = await Cart.findOne({ userId });

      // If no cart exists for the user, create one
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      // Check if the item already exists in the cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );
      if (existingItem) {
        // If it exists, update the quantity
        existingItem.quantity += quantity;
      } else {
        // If it doesn't exist, add a new item
        cart.items.push({ productId, quantity });
      }

      // Save the cart back to the database
      await cart.save();

      res.status(201).json(cart); // Return the updated cart
    } catch (error) {
      console.error("Error adding item to cart:", error); // Log the error for debugging
      res.status(500).json({ message: "Error adding item to cart", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
