import jwt from 'jsonwebtoken';
import connectDB from '../../config/db';
import authenticateToken from '../../middleware/authenticateToken'; // Assuming you use a custom JWT auth middleware
import User from '../../models/user';

export default async function handler(req, res) {
  await connectDB(); // Ensure the database connection

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { amount } = req.body;

  // Validate the deposit amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'A valid amount is required' });
  }

  // Authenticate the JWT token from the Authorization header
  return authenticateToken(req, res, async () => {
    try {
      // Find the user by their ID from the token
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Add the deposited amount to the user's wallet balance
      user.walletBalance = (parseFloat(user.walletBalance) + parseFloat(amount)).toFixed(2);
      await user.save();

      // Return success response with the updated balance
      res.status(200).json({ message: 'Funds deposited successfully', balance: user.walletBalance });
    } catch (error) {
      console.error('Error depositing funds:', error);
      res.status(500).json({ message: 'Failed to deposit funds', error });
    }
  });
}
