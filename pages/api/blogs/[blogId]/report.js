import prisma from "@/utils/db";
import { verifyToken } from "@/utils/auth";

/**
 * @swagger
 * /api/blogs/{blogId}/report:
 *   post:
 *     summary: Report a blog post
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Report
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the blog to report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: The reason for reporting the blog
 *     responses:
 *       201:
 *         description: The created report object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     reportedById:
 *                       type: integer
 *                     reason:
 *                       type: string
 *                     reportingType:
 *                       type: string
 *                     reportingID:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Blog ID or reason is invalid
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Blog or user not found
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Internal server error
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { blogId } = req.query;

    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required" });
    }

    const blog = await prisma.blogPost.findUnique({
      where: { id: parseInt(blogId) },
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const reason = req.body.reason;
    if (typeof reason !== "string" || reason.trim() === "") {
      return res.status(400).json({ error: "Invalid reason" });
    }

    const report = await prisma.report.create({
      data: {
        reportedById: decoded.id,
        reason: reason,
        reportingType: "blog_post",
        reportingID: parseInt(blogId),
      },
    });

    const updatedBlog = await prisma.blogPost.update({
      where: { id: parseInt(blogId) },
      data: {
        reportsCount: {
          increment: 1,
        },
      },
    });

    return res.status(201).json({ report });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
