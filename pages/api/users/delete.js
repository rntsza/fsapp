import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body;
    try {
      const deletedUser = await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).json(deletedUser);
    } catch (e) {
      res.status(400).json({ message: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', 'DELETE');
    res.status(405).end('Method Not Allowed');
  }
}
