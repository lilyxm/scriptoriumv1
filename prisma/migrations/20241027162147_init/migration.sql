-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatar" TEXT,
    "phoneNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "code_template_tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "code_templates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "code_templates_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "blog_post_tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" INTEGER NOT NULL,
    "upVotes" INTEGER NOT NULL DEFAULT 0,
    "downVotes" INTEGER NOT NULL DEFAULT 0,
    "ishidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comments" (
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
    CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comments_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "blog_posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "reportedById" INTEGER NOT NULL,
    "reportingType" TEXT NOT NULL,
    "reportingID" INTEGER NOT NULL,
    CONSTRAINT "reports_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CodeTemplateToCodeTemplateTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CodeTemplateToCodeTemplateTag_A_fkey" FOREIGN KEY ("A") REFERENCES "code_templates" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CodeTemplateToCodeTemplateTag_B_fkey" FOREIGN KEY ("B") REFERENCES "code_template_tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BlogPostToBlogPostTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogPostToBlogPostTag_A_fkey" FOREIGN KEY ("A") REFERENCES "blog_posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogPostToBlogPostTag_B_fkey" FOREIGN KEY ("B") REFERENCES "blog_post_tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BlogPostToCodeTemplate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogPostToCodeTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "blog_posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogPostToCodeTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "code_templates" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_CodeTemplateToCodeTemplateTag_AB_unique" ON "_CodeTemplateToCodeTemplateTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CodeTemplateToCodeTemplateTag_B_index" ON "_CodeTemplateToCodeTemplateTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostToBlogPostTag_AB_unique" ON "_BlogPostToBlogPostTag"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostToBlogPostTag_B_index" ON "_BlogPostToBlogPostTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostToCodeTemplate_AB_unique" ON "_BlogPostToCodeTemplate"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostToCodeTemplate_B_index" ON "_BlogPostToCodeTemplate"("B");
