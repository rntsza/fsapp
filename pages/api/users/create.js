import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, savingsBalance, checkingsBalance } = req.body;
    const password = bcrypt.hashSync(req.body.password, 10);
    try {
      const newUser = await prisma.user.create({
        data: { name, email, password, savingsBalance, checkingsBalance },
      });
      res.status(201).json(newUser);
    } catch (e) {
      console.error("Error creating user:", e);
      res.status(400).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
