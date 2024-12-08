import prisma from "@/utils/db";
import { verifyToken } from "@/utils/auth";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  return await hideRecord(req, res);
}

const hideRecord = async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { contentId, contentType } = req.query;

    if (!contentId || !contentType) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    if (contentType !== "comment" && contentType !== "blog_post") {
      return res.status(400).json({ error: "Invalid content type" });
    }

    let updatedRecord;
    if (contentType === "comment") {
      updatedRecord = await prisma.comment.update({
        where: { id: parseInt(contentId) },
        data: { ishidden: true },
      });
    } else if (contentType === "blog_post") {
      updatedRecord = await prisma.blogPost.update({
        where: { id: parseInt(contentId) },
        data: { ishidden: true },
      });
    } else {
      return res.status(400).json({ error: "Invalid content type" });
    }

    return res.status(200).json({ updatedRecord });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error updating record", message: error.message });
  }
};
