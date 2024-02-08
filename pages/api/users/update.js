import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id, name, email, savingsBalance, checkingsBalance } = req.body;
    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { name, email, savingsBalance, checkingsBalance },
      });
      res.status(200).json(updatedUser);
    } catch (e) {
      console.error("Error updating user:", e);
      res.status(400).json({ message: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', 'PUT');
    res.status(405).end('Method Not Allowed');
  }
}
