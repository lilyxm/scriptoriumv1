import prisma from "@/utils/db";
import { verifyToken } from "@/utils/auth";

/**
 * @swagger
 * /api/blogs/{blogId}/comments:
 *   post:
 *     summary: Add a new comment
 *     description: Adds a new comment to a blog post or another comment.
 *     tags:
 *       - Comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *               replyToID:
 *                 type: integer
 *                 description: The ID of the comment or blog post being replied to
 *               replyToType:
 *                 type: string
 *                 enum: [comment, blog_post]
 *                 description: The type of the entity being replied to
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the blog post
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 *   get:
 *     summary: Get comments
 *     description: Retrieves comments for a specific blog post. Admins can view all comments, including hidden ones. Regular users can only view their own comments and non-hidden comments.
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the blog post
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of comments per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, upVotes]
 *           default: createdAt
 *         description: The field to sort by
 *     responses:
 *       200:
 *         description: A list of comments
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    return addComment(req, res);
  } else if (req.method === "GET") {
    return getComments(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

async function addComment(req, res) {
  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { content, replyToID, replyToType } = req.body;
    const { blogId } = req.query;
    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Invalid content" });
    }
    if (!replyToID || !replyToType) {
      return res.status(400).json({ error: "Invalid replyTo" });
    }
    if (replyToType !== "comment" && replyToType !== "blog_post") {
      return res.status(400).json({ error: "Invalid replyToType" });
    }

    // Check if the blog post exists
    const blog = await prisma.blogPost.findUnique({
      where: { id: parseInt(blogId) },
    });
    if (!blog || blog.ishidden) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    // Check if the comment being replied to exists
    if (replyToType === "comment") {
      const comment = await prisma.comment.findUnique({
        where: { id: parseInt(replyToID) },
      });
      if (
        !comment ||
        comment.blogPostId !== parseInt(blogId) ||
        comment.ishidden
      ) {
        return res.status(404).json({ error: "Comment not found" });
      }
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        blogPostId: parseInt(blogId),
        authorId: user.id,
        replyToID: parseInt(replyToID),
        replyToType: replyToType,
      },
    });

    return res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getComments(req, res) {
  let decoded;
  try {
    decoded = verifyToken(req);
  } catch (error) {
    // Token verification failed, user is not authenticated
    decoded = null;
  }

  const { blogId, page = 1, limit = 10, sortBy = "createdAt" } = req.query;

  const skip = (page - 1) * limit;
  const orderBy =
    sortBy === "rating"
      ? [{ upVotes: "desc" }, { downVotes: "asc" }]
      : { createdAt: "desc" };

  const blog = await prisma.blogPost.findUnique({
    where: { id: parseInt(blogId) },
  });

  if (!blog) {
    return res.status(404).json({ error: "Blog post not found" });
  }
  console.log(decoded, blog.authorId, blog.ishidden);
  if (
    blog.ishidden &&
    (!decoded || (decoded.id !== blog.authorId && decoded.role === "USER"))
  ) {
    console.log(
      blog.ishidden &&
        (!decoded || (decoded.id !== blog.authorId && decoded.role === "USER"))
    );
    return res.status(404).json({ error: "Blog post not found" });
  }

  try {
    const whereClause = {
      blogPostId: parseInt(blogId),
    };

    if (!decoded || decoded.role !== "ADMIN") {
      whereClause.AND = [
        {
          OR: [{ ishidden: false }, decoded ? { authorId: decoded.id } : {}],
        },
      ];
    }

    const comments = await prisma.comment.findMany({
      where: whereClause,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: orderBy,
    });

    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
