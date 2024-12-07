import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../../utils/auth";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/vote:
 *   post:
 *     summary: Create a vote
 *     description: Allows a user to upvote or downvote a blog post or comment.
 *     tags:
 *       - Vote
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - votingId
 *               - votingType
 *               - isUpvote
 *             properties:
 *               votingId:
 *                 type: integer
 *                 description: The ID of the blog post or comment being voted on
 *               votingType:
 *                 type: string
 *                 enum: [blog_post, comment]
 *                 description: The type of the entity being voted on
 *               isUpvote:
 *                 type: boolean
 *                 description: Indicates if the vote is an upvote (true) or downvote (false)
 *     responses:
 *       200:
 *         description: Vote created
 *       400:
 *         description: Missing required fields or user already voted
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a vote
 *     description: Allows a user to delete their vote on a blog post or comment.
 *     tags:
 *       - Vote
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - votingId
 *               - votingType
 *             properties:
 *               votingId:
 *                 type: integer
 *                 description: The ID of the blog post or comment being voted on
 *               votingType:
 *                 type: string
 *                 enum: [blog_post, comment]
 *                 description: The type of the entity being voted on
 *     responses:
 *       200:
 *         description: Vote deleted
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Vote not found or user not found
 *       500:
 *         description: Internal server error
 */

async function findExistingVote(userId, votingId, votingType) {
  return await prisma.vote.findUnique({
    where: {
      userId_votingType_votingId: {
        userId,
        votingType,
        votingId: parseInt(votingId),
      },
    },
  });
}

async function createVote(userId, votingId, votingType, isUpVote) {
  return await prisma.vote.create({
    data: {
      userId: userId,
      votingId: parseInt(votingId),
      votingType: votingType,
      isUpVote: isUpVote,
    },
  });
}

async function deleteVote(userId, votingId, votingType) {
  return await prisma.vote.delete({
    where: {
      userId_votingType_votingId: {
        userId,
        votingType,
        votingId: parseInt(votingId),
      },
    },
  });
}

async function updateVoteCount(votingId, votingType, isUpvote, isDeleting) {
  let updateData;

  if (isDeleting) {
    updateData = isUpvote
      ? {
          upVotes: { decrement: 1 },
          value: { decrement: 1 },
          controversial: { decrement: 1 },
        }
      : {
          downVotes: { decrement: 1 },
          value: { increment: 1 },
          controversial: { decrement: 1 },
        };
  } else {
    updateData = isUpvote
      ? {
          upVotes: { increment: 1 },
          value: { increment: 1 },
          controversial: { increment: 1 },
        }
      : {
          downVotes: { increment: 1 },
          value: { decrement: 1 },
          controversial: { increment: 1 },
        };
  }

  if (votingType === "blog_post") {
    await prisma.blogPost.update({
      where: { id: parseInt(votingId) },
      data: updateData,
    });
  } else if (votingType === "comment") {
    await prisma.comment.update({
      where: { id: parseInt(votingId) },
      data: updateData,
    });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { votingId, votingType, isUpvote } = req.body;

  if (
    !votingId ||
    !votingType ||
    (req.method === "POST" && isUpvote === undefined)
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const decoded = verifyToken(req);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user.id;

    if (req.method === "POST") {
      const vote = await findExistingVote(userId, votingId, votingType);

      if (vote) {
        return res.status(400).json({ error: "User already voted" });
      }
      console.log("here");

      await createVote(userId, votingId, votingType, isUpvote);
      console.log("here");
      await updateVoteCount(votingId, votingType, isUpvote, false);
      console.log("here");
      return res.status(200).json({ message: "Vote created" });
    } else if (req.method === "DELETE") {
      const vote = await findExistingVote(userId, votingId, votingType);
      if (!vote) {
        return res.status(404).json({ error: "Vote not found" });
      }
      await deleteVote(userId, votingId, votingType);
      await updateVoteCount(votingId, votingType, vote.isUpVote, true);
      return res.status(200).json({ message: "Vote deleted" });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
