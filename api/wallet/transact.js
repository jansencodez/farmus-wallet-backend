import connectDB from '../../config/db';
import authenticateToken from '../../middleware/authenticateToken';
import User from '../../models/user';
// You may want to import a Product model if you have one to check item availability

export default async function handler(req, res) {
  await connectDB(); // Ensure the database connection

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { itemId, amount, sellerId } = req.body;

  // Validate input
  if (!itemId || !amount || !sellerId) {
    return res.status(400).json({ message: 'Item ID, amount, and seller ID are required' });
  }

  return authenticateToken(req, res, async () => {
    try {
      const buyer = await User.findById(req.user.userId);
      const seller = await User.findById(sellerId);

      // Check if both users exist
      if (!buyer || !seller) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the buyer has sufficient balance
      if (parseFloat(buyer.walletBalance) < parseFloat(amount)) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      // Here you can check if the product is available (if applicable)
      // const product = await Product.findById(itemId);
      // if (!product || !product.isAvailable) {
      //   return res.status(400).json({ message: 'Product not available' });
      // }

      // Process the transaction
      buyer.walletBalance = (parseFloat(buyer.walletBalance) - parseFloat(amount)).toFixed(2);
      seller.walletBalance = (parseFloat(seller.walletBalance) + parseFloat(amount)).toFixed(2);

      // Save updated balances
      await buyer.save();
      await seller.save();

      // Optionally log the transaction here for auditing purposes
      // await Transaction.create({ itemId, buyerId: buyer._id, sellerId: seller._id, amount });

      // Return success response
      res.status(200).json({
        message: 'Purchase successful',
        buyerBalance: buyer.walletBalance,
        sellerBalance: seller.walletBalance,
      });
    } catch (error) {
      console.error('Error processing purchase:', error);
      res.status(500).json({ message: 'Failed to process purchase', error });
    }
  });
}
