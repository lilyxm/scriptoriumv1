import React from "react";
import { useRouter } from "next/router";
import { BlogPost } from "../../utils/types";

interface LinkedBlogsProps {
  blogPosts: BlogPost[];
}

const LinkedBlogs: React.FC<LinkedBlogsProps> = ({ blogPosts }) => {
  const router = useRouter();

  const handleClick = (id: number) => {
    router.push(`/blogs/${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Linked Blogs
      </h3>
      {blogPosts.length > 0 ? (
        blogPosts.map((post) => (
          <div
            key={post.id}
            className="mb-3 flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => handleClick(post.id)}
          >
            <span className="text-blue-600 dark:text-blue-400 hover:underline">
              {post.title}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          No linked blogs available.
        </p>
      )}
    </div>
  );
};

export default LinkedBlogs;
