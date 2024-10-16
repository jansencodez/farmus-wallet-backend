import connectDB from '../../config/db';
import authenticateToken from '../../middleware/authenticateToken';
import User from '../../models/user';

export default async function handler(req, res) {
  await connectDB(); // Ensure the database is connected

  console.log('Request Method:', req.method); // Log the request method

  // Only handle GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Authenticate the user
  return authenticateToken(req, res, async () => {
    try {
      const user = await User.findById(req.user.userId);
      console.log('Authenticated User:', user); // Log the authenticated user

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ balance: user.walletBalance });
    } catch (error) {
      console.error('Error fetching balance:', error);
      res.status(500).json({ message: 'Failed to fetch balance', error });
    }
  });
}

