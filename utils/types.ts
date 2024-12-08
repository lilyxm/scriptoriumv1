export type User = {
  id: number;
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  role: "ADMIN" | "USER";
  CodeTemplate: CodeTemplate[];
  BlogPost: BlogPost[];
  Comment: Comment[];
  Report: Report[];
  Vote: Vote[];
};

export type CodeTemplateTag = {
  id: number;
  name: string;
  codeTemplate: CodeTemplate[];
};

export type CodeTemplate = {
  id: number;
  title: string;
  description: string;
  code: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  authorId: number;
  CodeTemplateTag: CodeTemplateTag[];
  BlogPost: BlogPost[];
  likendTemp?: CodeTemplate[];
};

export type BlogPostTag = {
  id: number;
  name: string;
  blogPost: BlogPost[];
};

export type BlogPost = {
  id: number;
  title: string;
  description: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  authorId: number;
  BlogPostTag: BlogPostTag[];
  Comment: Comment[];
  likendTemp: CodeTemplate[];
  upVotes: number;
  downVotes: number;
  value: number;
  controversial: number;
  reportsCount: number;
  ishidden: boolean;
};

export type Comment = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  authorId: number;
  blogPost: BlogPost;
  blogPostId: number;
  replyToID: number;
  replyToType: "blog_post" | "comment";
  upVotes: number;
  downVotes: number;
  value: number;
  controversial: number;
  ishidden: boolean;
  reportsCount: number;
};

export type Report = {
  id: number;
  createdAt: Date;
  reason: string;
  reportedBy: User;
  reportedById: number;
  reportingType: "blog_post" | "comment";
  reportingID: number;
};

export type Vote = {
  id: number;
  createdAt: Date;
  user: User;
  userId: number;
  votingType: "blog_post" | "comment";
  votingId: number;
  isUpVote: boolean;
};
