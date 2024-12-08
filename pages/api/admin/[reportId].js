import prisma from "@/utils/db";
import { verifyToken } from "@/utils/auth";

/**
 * @swagger
 * /api/reports/{reportId}:
 *   put:
 *     summary: Hide a reported comment/blog post by report ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Report
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the report to update
 *     responses:
 *       200:
 *         description: The updated report object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedRecord:
 *                   type: object
 *                   description: The updated record
 *       400:
 *         description: Report ID is required or invalid reporting type
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Report not found
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Internal server error
 */

export default async function handler(req, res) {
  if (req.method === "PUT") {
    return hideRecord(req, res);
  } else if (req.method === "GET") {
    return getReport(req, res);
  } else if (req.method === "DELETE") {
    return deleteReport(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

const deleteReport = async (req, res) => {
  try {
    console.log("deleteReport");
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { reportId } = req.query;

    if (!reportId) {
      return res.status(400).json({ error: "Report ID is required" });
    }

    console.log("reportId", reportId);

    const report = await prisma.report.findUnique({
      where: { id: parseInt(reportId) },
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    await prisma.report.delete({
      where: { id: parseInt(reportId) },
    });

    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getReport = async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { reportId } = req.query;

    if (!reportId) {
      return res.status(400).json({ error: "Report ID is required" });
    }

    const report = await prisma.report.findUnique({
      where: { id: parseInt(reportId) },
      include: {
        reportedBy: true,
      },
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    return res.status(200).json({ report });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error fetching report", message: error.message });
  }
};

const hideRecord = async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { reportId } = req.query;

    if (!reportId) {
      return res.status(400).json({ error: "Report ID is required" });
    }

    const report = await prisma.report.findUnique({
      where: { id: parseInt(reportId) },
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    let updatedRecord;
    if (report.reportingType === "comment") {
      updatedRecord = await prisma.comment.update({
        where: { id: report.reportingID },
        data: { ishidden: true },
      });
    } else if (report.reportingType === "blog_post") {
      updatedRecord = await prisma.blogPost.update({
        where: { id: report.reportingID },
        data: { ishidden: true },
      });
    } else {
      return res.status(400).json({ error: "Invalid reporting type" });
    }

    return res.status(200).json({ updatedRecord });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error updating record", message: error.message });
  }
};
