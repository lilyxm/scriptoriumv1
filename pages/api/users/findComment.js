import { verifyToken } from "@/utils/auth";
import prisma from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Get comment id from query params
    const commentId = req.query.commentId;
    // console.log(commentId);

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    return res.status(200).json({ comment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
