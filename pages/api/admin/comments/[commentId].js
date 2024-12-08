import prisma from "@/utils/db";
import { verifyToken } from "@/utils/auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return adminGetCommentById(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

async function adminGetCommentById(req, res) {
  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { commentId } = req.query;

    if (!commentId) {
      return res.status(400).json({ error: "Missing commentId" });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    return res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
