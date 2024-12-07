/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `blog_post_tags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `code_template_tags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "blog_post_tags_name_key" ON "blog_post_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "code_template_tags_name_key" ON "code_template_tags"("name");
