import prisma from "@/utils/db";
import { verifyToken } from "@/utils/auth";

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Retrieve all reports
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Report
 *     responses:
 *       200:
 *         description: A list of reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   reportingType:
 *                     type: string
 *                   reportingID:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       403:
 *         description: Forbidden
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Internal server error
 */

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const reports = await prisma.report.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(reports);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
