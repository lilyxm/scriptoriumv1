import { verifyToken } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog post
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Blog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blog post
 *               description:
 *                 type: string
 *                 description: The description of the blog post
 *               content:
 *                 type: string
 *                 description: The content of the blog post
 *               BlogPostTag:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The name of the tag
 *               likendTemp:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   description: The ID of the likendTemp
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created blog post
 *                 title:
 *                   type: string
 *                   description: The title of the blog post
 *                 description:
 *                   type: string
 *                   description: The description of the blog post
 *                 content:
 *                   type: string
 *                   description: The content of the blog post
 *                 authorId:
 *                   type: integer
 *                   description: The ID of the author
 *                 BlogPostTag:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the tag
 *                 likendTemp:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the likendTemp
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get all blog posts
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter blog posts
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [rating, createdAt]
 *         description: Sort blog posts by rating or creation date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of blog posts per page
 *     responses:
 *       200:
 *         description: A list of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the blog post
 *                   title:
 *                     type: string
 *                     description: The title of the blog post
 *                   description:
 *                     type: string
 *                     description: The description of the blog post
 *                   content:
 *                     type: string
 *                     description: The content of the blog post
 *                   authorId:
 *                     type: integer
 *                     description: The ID of the author
 *                   BlogPostTag:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: The ID of the tag
 *                   likendTemp:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: The ID of the likendTemp
 *       500:
 *         description: Internal server error
 */

export default async function handler(req, res) {
  if (req.method === "POST") {
    return postBlog(req, res);
  } else if (req.method === "GET") {
    return getBlogs(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

async function postBlog(req, res) {
  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { title, description, content, BlogPostTag, likendTemp } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ error: "Missing required fields" });
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

    const blog = await prisma.blogPost.create({
      data: {
        title,
        description,
        content,
        authorId: user.id,
        BlogPostTag: tagIds.length > 0 ? { connect: tagIds } : undefined,
        likendTemp:
          templateIds.length > 0 ? { connect: templateIds } : undefined,
      },
    });
    return res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error updating database", message: error.message });
  }
}

async function getBlogs(req, res) {
  const {
    sortBy,
    page = 1,
    limit = 10,
    searchTitle,
    searchContent,
    searchDescription,
    searchTags,
    searchCodeTemplates,
  } = req.query;

  const skip = (page - 1) * limit;

  try {
    let decoded;
    try {
      decoded = verifyToken(req);
    } catch (error) {
      // Token verification failed, user is not authenticated
      decoded = null;
    }

    const whereClause = {
      AND: [
        searchTitle ? { title: { contains: searchTitle } } : {},
        searchContent ? { content: { contains: searchContent } } : {},
        searchDescription
          ? { description: { contains: searchDescription } }
          : {},
        searchTags
          ? { BlogPostTag: { some: { name: { contains: searchTags } } } }
          : {},
        searchCodeTemplates
          ? {
              likendTemp: {
                some: { title: { contains: searchCodeTemplates } },
              },
            }
          : {},
      ],
    };

    if (!decoded || decoded.role !== "ADMIN") {
      whereClause.AND.push({
        OR: [{ ishidden: false }, decoded ? { authorId: decoded.id } : {}],
      });
    }

    const orderByClause = (() => {
      switch (sortBy) {
        case "value":
          return { value: "desc" };
        case "controversial":
          return { controversial: "desc" };
        default:
          return { createdAt: "desc" };
      }
    })();

    const blogs = await prisma.blogPost.findMany({
      where: whereClause,
      include: {
        BlogPostTag: true,
        likendTemp: true,
        author: true,
      },
      orderBy: orderByClause,
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    return res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
