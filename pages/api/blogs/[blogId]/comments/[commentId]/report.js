import prisma from "@/utils/db";
import { verifyToken } from "@/utils/auth";

/**
 * @swagger
 * /api/blogs/{blogId}/comments/{commentId}/report:
 *   post:
 *     summary: Report a comment
 *     description: Allows a user to report a comment for inappropriate content.
 *     tags:
 *       - Report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: The reason for reporting the comment
 *                 example: "Inappropriate content"
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the blog post
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the comment being reported
 *     responses:
 *       201:
 *         description: Report created successfully
 *       400:
 *         description: Missing blogId or commentId, or invalid reason
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 *       405:
 *         description: Method Not Allowed
 *       500:
 *         description: Internal Server Error
 *     security:
 *       - bearerAuth: []
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { blogId, commentId } = req.query;
    if (!blogId || !commentId) {
      return res.status(400).json({ message: "Missing blogId or commentId" });
    }
    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(commentId),
        blogPostId: parseInt(blogId),
      },
    });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reason = req.body.reason;
    if (typeof reason !== "string" || reason.trim() === "") {
      return res.status(400).json({ error: "Invalid reason" });
    }

    const report = await prisma.report.create({
      data: {
        reportedById: user.id,
        reason: reason,
        reportingType: "comment",
        reportingID: parseInt(commentId),
      },
    });

    const updatedComment = await prisma.comment.update({
      where: {
        id: parseInt(commentId),
      },
      data: {
        reportsCount: {
          increment: 1,
        },
      },
    });

    return res.status(201).json({ report });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
