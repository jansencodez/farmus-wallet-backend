import connectDB from "../../../config/db";
import { Cart, User } from "../../../models/user";

export default async function handler(req, res) {
  const { id: userId } = req.query; // Use `id` as per your query parameter

  await connectDB();

  if (req.method === "POST") {
    try {
      const { productId, quantity, price } = req.body; // Ensure price is included in the body
      console.log("Incoming data:", { productId, quantity, price }); // Log incoming data

      // Find the user
      const user = await User.findById(userId).populate("cart"); // Populate cart if exists
      let cart;

      // If no cart exists for the user, create one
      if (!user.cart) {
        cart = new Cart({ items: [] });
        await cart.save();

        // Update the user with the cart ID
        user.cart = cart._id;
        await user.save();
      } else {
        cart = user.cart; // Use the existing cart
      }

      // Check if the item already exists in the cart
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        // If it exists, update the quantity
        existingItem.quantity += quantity;
      } else {
        // If it doesn't exist, add a new item
        cart.items.push({ product: productId, quantity, price });
      }

      // Save the updated cart back to the database
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
