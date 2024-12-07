/*
  Warnings:

  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Vote";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "votes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "votingType" TEXT NOT NULL,
    "votingID" INTEGER NOT NULL,
    "isUpVote" BOOLEAN NOT NULL,
    CONSTRAINT "votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "votes_userId_votingType_votingID_key" ON "votes"("userId", "votingType", "votingID");
