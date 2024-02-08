import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    const { type, balance } = req.body;
    try {
      const user = await prisma.user.create({
        data: { type, balance },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Failed to create user." });
    }
  }
}