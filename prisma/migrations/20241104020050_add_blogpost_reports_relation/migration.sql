-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_blog_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" INTEGER NOT NULL,
    "upVotes" INTEGER NOT NULL DEFAULT 0,
    "downVotes" INTEGER NOT NULL DEFAULT 0,
    "reportsCount" INTEGER NOT NULL DEFAULT 0,
    "ishidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_blog_posts" ("authorId", "content", "createdAt", "description", "downVotes", "id", "ishidden", "title", "upVotes", "updatedAt") SELECT "authorId", "content", "createdAt", "description", "downVotes", "id", "ishidden", "title", "upVotes", "updatedAt" FROM "blog_posts";
DROP TABLE "blog_posts";
ALTER TABLE "new_blog_posts" RENAME TO "blog_posts";
CREATE TABLE "new_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" INTEGER NOT NULL,
    "blogPostId" INTEGER NOT NULL,
    "replyToID" INTEGER NOT NULL,
    "replyToType" TEXT NOT NULL,
    "upVotes" INTEGER NOT NULL DEFAULT 0,
    "downVotes" INTEGER NOT NULL DEFAULT 0,
    "ishidden" BOOLEAN NOT NULL DEFAULT false,
    "reportsCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comments_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "blog_posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("authorId", "blogPostId", "content", "createdAt", "downVotes", "id", "ishidden", "replyToID", "replyToType", "upVotes", "updatedAt") SELECT "authorId", "blogPostId", "content", "createdAt", "downVotes", "id", "ishidden", "replyToID", "replyToType", "upVotes", "updatedAt" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
