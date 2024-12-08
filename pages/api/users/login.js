import prisma from "@/utils/db";
import {
  comparePassword,
  generateToken,
  generateRefreshToken,
} from "@/utils/auth";

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user with username and password and return an access token.
 *     tags:
 *        - User
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
 *                 description: The user's username
 *               password:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The JWT access token
 *       401:
 *         description: Invalid credentials or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({
      error: "Please provide all the required fields",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const accessToken = generateToken({
      id: user.id,
      role: user.role,
      CreatedAt: Date.now(),
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      role: user.role,
      CreatedAt: Date.now(),
    });
    return res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
