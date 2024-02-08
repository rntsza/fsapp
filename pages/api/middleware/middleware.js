import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';

const authMiddleware = (handler) => async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        savingsBalance: true,
        checkingsBalance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    req.user = user;

    return handler(req, res);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Invalid token.' });
  }
};

export default authMiddleware;
