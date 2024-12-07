-- CreateTable
CREATE TABLE "Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "blogPostId" INTEGER,
    "commentId" INTEGER,
    CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "blog_posts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Vote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_blogPostId_key" ON "Vote"("userId", "blogPostId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_commentId_key" ON "Vote"("userId", "commentId");
