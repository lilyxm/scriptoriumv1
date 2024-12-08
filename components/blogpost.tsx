import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

interface Blog {
  id: number;
  title: string;
  description: string;
  upVotes: number;
  downVotes: number;
  author?: {
    username: string;
    avatar: string;
  };
  BlogPostTag: { id: number; name: string }[];
}

interface BlogPostProps {
  blogs: Blog[];
  isManage: boolean;
}

const BlogPostList: React.FC<BlogPostProps> = ({ blogs, isManage }) => {
  const handleBlogDelete = async (blogId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (res.ok) {
        //reload the page
        router.reload();
      } else {
        console.error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <ul className="mt-4 space-y-4">
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <li
            key={blog.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
          >
            <div
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 cursor-pointer"
              onClick={() => (window.location.href = `/blogs/${blog.id}`)}
            >
              <div className="flex flex-col items-center space-y-2">
                {blog.author && (
                  <>
                    <img
                      src={blog.author.avatar || "/user-avatar.png"}
                      alt={blog.author.username}
                      className="w-12 h-12 rounded-full"
                    />
                    <p className="text-gray-600 dark:text-gray-400">
                      {blog.author.username}
                    </p>
                  </>
                )}
              </div>
              <div className="col-span-2">
                <a
                  href={`/blogs/${blog.id}`}
                  className="text-lg font-semibold text-blue-600 dark:text-blue-400"
                >
                  {blog.title}
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {blog.description}
                </p>
              </div>
              <div className="flex flex-col justify-between items-end">
                <p className="text-gray-600 dark:text-gray-400">
                  ID: {blog.id}
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
                    <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                    {blog.upVotes}
                  </span>
                  <span className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <FontAwesomeIcon icon={faThumbsDown} className="mr-1" />
                    {blog.downVotes}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {blog.BlogPostTag.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full bg-blue-500 text-white"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {isManage && (
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/blogs/edit/${blog.id}`;
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition duration-200"
                  onClick={() => handleBlogDelete(blog.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No blog posts available.
        </p>
      )}
    </ul>
  );
};

export default BlogPostList;