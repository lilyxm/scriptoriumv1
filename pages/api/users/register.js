import prisma from "@/utils/db";
import { hashPassword } from "@/utils/auth";

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with a username and password. If the role is ADMIN, an adminSecret is required.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user
 *               password:
 *                 type: string
 *                 description: The password for the new user
 *               role:
 *                 type: string
 *                 description: The role of the new user (USER or ADMIN)
 *               adminSecret:
 *                 type: string
 *                 description: The secret key required to register as an admin
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Bad request (e.g., username already taken, missing username or password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       403:
 *         description: Unauthorized to register as admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password, role, adminSecret } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  if (role === "ADMIN" && adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: "Unauthorized to register as admin" });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const user = await prisma.user.create({
      data: {
        username,
        role: role === "ADMIN" ? "ADMIN" : "USER",
        password: await hashPassword(password),
      },
    });

    return res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
