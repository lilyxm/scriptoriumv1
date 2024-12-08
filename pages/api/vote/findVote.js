import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../../utils/auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { votingId, votingType } = req.query;

    if (!votingId || !votingType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const decoded = verifyToken(req);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user.id;

    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: userId,
        votingId: parseInt(votingId),
        votingType: votingType,
      },
    });

    if (existingVote) {
      res.status(200).json(existingVote);
    } else {
      res.status(402).json({ message: "Vote not found" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
