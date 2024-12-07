import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/blogs/{blogId}:
 *   get:
 *     summary: Get a blog by ID
 *     description: Retrieve a blog by its ID. If the blog is hidden, only the author or an admin can view it.
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the blog to retrieve
 *     responses:
 *       200:
 *         description: A blog object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 content:
 *                   type: string
 *                 ishidden:
 *                   type: boolean
 *                 authorId:
 *                   type: integer
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Edit a blog by ID
 *     description: Edit a blog by its ID. Only the author can edit the blog.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the blog to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               BlogPostTag:
 *                 type: array
 *                 items:
 *                   type: string
 *               likendTemp:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: The updated blog object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 content:
 *                   type: string
 *                 BlogPostTag:
 *                   type: array
 *                   items:
 *                     type: string
 *                 likendTemp:
 *                   type: array
 *                   items:
 *                     type: integer
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Blog or user not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a blog by ID
 *     description: Delete a blog by its ID. Only the author can delete the blog.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the blog to delete
 *     responses:
 *       204:
 *         description: No content
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Blog or user not found
 *       500:
 *         description: Internal server error
 */

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getBlogByID(req, res);
  } else if (req.method === "PUT") {
    return editBlogByID(req, res);
  } else if (req.method === "DELETE") {
    return deleteBlogByID(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

async function getBlogByID(req, res) {
  const { blogId } = req.query;

  try {
    const blog = await prisma.blogPost.findUnique({
      where: { id: parseInt(blogId) },
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.ishidden) {
      // Only the author or ADMIN can view hidden blogs
      const decoded = verifyToken(req);
      if (blog.authorId !== decoded.id && decoded.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    return res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function editBlogByID(req, res) {
  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { blogId } = req.query;
    const { title, description, content, BlogPostTag, likendTemp } = req.body;
    const blog = await prisma.blogPost.findUnique({
      where: { id: parseInt(blogId) },
    });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    if (blog.authorId !== user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Process BlogPostTag
    let tagIds = [];
    if (BlogPostTag && BlogPostTag.length > 0) {
      for (const tagName of BlogPostTag) {
        let tag = await prisma.BlogPostTag.findUnique({
          where: { name: tagName },
        });
        if (!tag) {
          tag = await prisma.BlogPostTag.create({
            data: { name: tagName },
          });
        }
        tagIds.push({ id: tag.id });
      }
    }

    // Process likendTemp
    let templateIds = [];
    if (likendTemp && likendTemp.length > 0) {
      for (const tempId of likendTemp) {
        const template = await prisma.CodeTemplate.findUnique({
          where: { id: tempId },
        });
        if (!template) {
          return res
            .status(400)
            .json({ error: `Template with ID ${tempId} not found` });
        }
        templateIds.push({ id: tempId });
      }
    }

    const updatedBlog = await prisma.blogPost.update({
      where: { id: parseInt(blogId) },
      data: {
        title,
        description,
        content,
        BlogPostTag: tagIds.length > 0 ? { connect: tagIds } : undefined,
        likendTemp:
          templateIds.length > 0 ? { connect: templateIds } : undefined,
      },
    });
    return res.status(200).json(updatedBlog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteBlogByID(req, res) {
  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { blogId } = req.query;
    const blog = await prisma.blogPost.findUnique({
      where: { id: parseInt(blogId) },
    });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    if (blog.authorId !== user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.blogPost.delete({
      where: { id: parseInt(blogId) },
    });
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
