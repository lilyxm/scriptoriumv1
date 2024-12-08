// /home/lilyxm/F2024/CSC309/Project/PP1/pages/api/code/templates/index.js
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/auth";
//filter by title, tags, content FOR VISITOR
export default async function handler(req, res) {
  if (req.method === "GET") {
    // Handle GET request
    var { title = "", tags = [], content = "", description = "" } = req.query;
    var authorId = req.query.authorId;

    //console.log(tags);
    if (typeof tags === "string") {
      tags = tags
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((tag) => tag.trim());
    }
    //console.log(tags);
    if (authorId) {
      try {
        const user = verifyToken(req);
        //console.log("UserID", user.id);
        if (user.id != authorId) {
          return res
            .status(401)
            .send("Unauthorized: token and authorId query do not match");
        }
      } catch (error) {
        if (error.message === "Token expired") {
          return res.status(402).json({ error: "Token expired" });
        }
        console.error("Error finding or creating tag:", error);
        return res.status(401).json({ error: error.message });
      }
    }
    //get all code templates
    //console.log(req.body);

    //returns all requested code templates with the given title, tags, and content
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const codeTemplates = await prisma.codeTemplate.findMany({
      where: {
        AND: [
          { title: { contains: title } },
          { code: { contains: content } },
          { description: { contains: description } },
          ...(authorId ? [{ authorId: parseInt(authorId) }] : []),
          ...tags.map((tag) => ({
            CodeTemplateTag: {
              some: { name: tag },
            },
          })),
        ],
      },
      include: {
        CodeTemplateTag: true,
        author: true,
      },
      skip: skip,
      take: pageSize,
    });

    const totalTemplates = await prisma.codeTemplate.count({
      where: {
        AND: [
          { title: { contains: title } },
          { code: { contains: content } },
          { description: { contains: description } },
          ...(authorId ? [{ authorId: parseInt(authorId) }] : []),
          ...tags.map((tag) => ({
            CodeTemplateTag: {
              some: { name: tag },
            },
          })),
        ],
      },
    });
    // //console.log("codeTemplates", codeTemplates);
    return res.status(200).json({ codeTemplates, totalTemplates, page, pageSize });
  }
}
