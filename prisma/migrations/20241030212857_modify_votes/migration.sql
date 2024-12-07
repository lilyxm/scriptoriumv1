/*
  Warnings:

  - You are about to drop the column `votingID` on the `votes` table. All the data in the column will be lost.
  - Added the required column `votingId` to the `votes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_votes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "votingType" TEXT NOT NULL,
    "votingId" INTEGER NOT NULL,
    "isUpVote" BOOLEAN NOT NULL,
    CONSTRAINT "votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_votes" ("createdAt", "id", "isUpVote", "userId", "votingType") SELECT "createdAt", "id", "isUpVote", "userId", "votingType" FROM "votes";
DROP TABLE "votes";
ALTER TABLE "new_votes" RENAME TO "votes";
CREATE UNIQUE INDEX "votes_userId_votingType_votingId_key" ON "votes"("userId", "votingType", "votingId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
