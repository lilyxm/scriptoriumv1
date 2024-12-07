import prisma from "@/utils/db";
import { verifyToken } from "@/utils/auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return adminGetComments(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

async function adminGetComments(req, res) {
  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const sortByReports = req.query.sortByReports === "true";

    const comments = await prisma.comment.findMany({
      orderBy: sortByReports
        ? {
            reportsCount: "desc",
          }
        : {
            createdAt: "desc",
          },
      include: {
        author: {
          select: { username: true },
        },
      },
    });

    return res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
