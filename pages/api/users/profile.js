import prisma from "@/utils/db";
import { verifyToken } from "@/utils/auth";



/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     security:
 *        - bearerAuth: []
 *     description: Retrieves the profile of the authenticated user.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       404:
 *         description: User not found
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
 *   put:
 *     summary: Update user profile
 *     description: Updates the profile of the authenticated user.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The new email of the user
 *               firstName:
 *                 type: string
 *                 description: The new first name of the user
 *               lastName:
 *                 type: string
 *                 description: The new last name of the user
 *               avatar:
 *                 type: string
 *                 description: The new avatar of the user
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     avatar:
 *                       type: string
 *       400:
 *         description: Invalid email format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: User not found
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
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


export default async function handler(req, res) {
  if (req.method === "GET") {
    return getProfile(req, res);

  } else if (req.method === "PUT") {
    console.log("this is req.body: ", req.body);


    return updateProfile(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

async function getProfile(req, res) {
  try {
    const decoded = verifyToken(req);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      username: user.username,
      role: user.role,
      phoneNumber: user.phoneNumber,
    };


    return res.status(200).json({ profile });
  } catch (error) {
    console.error(error);
    if (error.message === "Token expired") {
      return res.status(402).json({ error: "Token expired" });
    }
    if (error.message === "Invalid token") {
      return res.status(401).json({ error: "Invalid token" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function updateProfile(req, res) {
  try {
    const decoded = verifyToken(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { email, firstName, lastName, avatar, phoneNumber } = req.body;
    console.log("this is req.body: ", req.body);

    if (email) {
      if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      user.email = email;
    }
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (avatar) {
      user.avatar = avatar;
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
      },
    });

    return res.status(200).json({
      profile: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {

    console.error(error);
    if (error.message === "Token expired") {
      return res.status(402).json({ error: "Token expired" });
    }
    if (error.message === "Invalid token") {
      return res.status(401).json({ error: "Invalid token" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}
