import authMiddleware from '../middleware/middleware';

const handler = async (req, res) => {
  res.status(200).json({ message: 'You are authenticated!', user: req.user });
};

export default authMiddleware(handler);