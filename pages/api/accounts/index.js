import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const user = await prisma.user.findMany();
    res.status(200).json(user);
  } else if (req.method === 'POST') {
    const { type, balance } = req.body;
    const user = await prisma.user.create({
      data: { type, balance },
    });
    res.status(201).json(user);
  }
}
