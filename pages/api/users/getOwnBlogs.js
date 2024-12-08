import { verifyToken } from "../../../utils/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  console.log("this is req.body: ", req.body);
  if (req.method === "GET") {
    return getMyBlogs(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

async function getMyBlogs(req, res) {
  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return getBlogs(req, res, user, decoded);

  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}


async function getBlogs(req, res, user, decoded) {
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
    const whereClause = {
      AND: [
        { authorId: user.id },
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
      },
      orderBy: orderByClause,
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    return res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error", message: error.message });
  }
}
