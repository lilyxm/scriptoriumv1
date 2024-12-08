import prisma from "@/utils/db";
import { verifyToken } from "@/utils/auth";
/**
 * @swagger
 * /api/blogs/{blogId}/comments/{commentId}:
 *   get:
 *     summary: Retrieve a comment by ID
 *     description: Retrieve a comment by its ID. If the comment is hidden, only the author or an admin can view it.
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the blog post
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: A comment object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 authorId:
 *                   type: integer
 *                 blogPostId:
 *                   type: integer
 *                 ishidden:
 *                   type: boolean
 *       400:
 *         description: Missing blogId or commentId
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
 *     security:
 *       - bearerAuth: []
 */
export default async function handler(req, res) {
  if (req.method === "GET") {
    return getCommentById(req, res);
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

async function getCommentById(req, res) {
  try {
    const { blogId, commentId } = req.query;

    let decoded;
    try {
      decoded = verifyToken(req);
    } catch (error) {
      console.error(error);
      // Token verification failed, user is not authenticated
      decoded = null;
    }

    if (!blogId || !commentId) {
      return res.status(400).json({ message: "Missing blogId or commentId" });
    }

    // Check if the blog post exists
    const blog = await prisma.blogPost.findUnique({
      where: { id: parseInt(blogId) },
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    console.log("decoded", decoded);
    // Check if the blog is hidden, only the author or an admin can view it
    console.log(decoded.id, blog.authorId, decoded.role);
    if (
      blog.ishidden &&
      (!decoded || (decoded.id !== blog.authorId && decoded.role === "USER"))
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(commentId),
      },
      include: {
        author: true,
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.blogPostId !== parseInt(blogId)) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (
      comment.ishidden &&
      (!decoded || (decoded.id !== comment.authorId && decoded.role === "USER"))
    ) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
