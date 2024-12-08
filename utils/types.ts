import {
  User,
  BlogPost as prismaBlogPost,
  CodeTemplate,
  Comment,
  Report,
  Vote,
  CodeTemplateTag,
  BlogPostTag,
} from "@prisma/client";

interface BlogPost extends prismaBlogPost {
  BlogPostTag: BlogPostTag[];
  likendTemp: CodeTemplate[];
}

// Exporting Prisma types for reuse
export type {
  User,
  BlogPost,
  CodeTemplate,
  Comment,
  Report,
  Vote,
  CodeTemplateTag,
  BlogPostTag,
};
