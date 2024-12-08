import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/header";
import CommentSection from "@/components/CommentSection";
import { BlogPost, Comment } from "@/utils/types";
import ReportForm from "@/components/ReportFrom";
import { BlogPostTag } from "@/utils/types";
import { CodeTemplate } from "@/utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

const BlogDetails: React.FC = () => {
  const router = useRouter();
  const { blogId } = router.query;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userID = localStorage.getItem("userID");
    const userRole = localStorage.getItem("userRole");
    if (userRole === "ADMIN") {
      setIsAdmin(true);
    }

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    const fetchBlog = async () => {
      if (!blogId) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/blogs/${blogId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data) {
          setBlog(data);
          setIsHidden(data.ishidden);
          console.log("Blog:", data);
          // Check if the current user is the author of the blog
          if (userID && data.authorId === parseInt(userID)) {
            setIsAuthor(true);
          }
        } else {
          console.error("Failed to fetch blog");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserVote = async () => {
      if (!blogId || !token) return;
      try {
        const res = await fetch(
          `/api/vote/findVote?votingId=${blogId}&votingType=blog_post`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok && data) {
          if (data.isUpVote === true) {
            setUserVote("upvote");
          } else if (data.isUpVote === false) {
            setUserVote("downvote");
          } else {
            setUserVote(null);
          }
        }
      } catch (error) {
        console.error("Error fetching user vote:", error);
      }
    };

    fetchUserVote();
    fetchBlog();
  }, [blogId]);

  const handleReport = async (reason: string) => {
    if (!isAuthenticated) {
      alert("You need to be logged in to report a blog");
      return;
    }

    try {
      const res = await fetch(`/api/blogs/${blogId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        alert("Blog reported successfully");
      } else {
        console.error("Failed to report blog");
      }
    } catch (error) {
      console.error("Error reporting blog:", error);
    } finally {
      setShowReportForm(false);
    }
  };

  const createVote = async (isUpvote: boolean) => {
    try {
      const res = await fetch(`/api/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          isUpvote: isUpvote,
          votingType: "blog_post",
          votingId: blogId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBlog(data);
        setUserVote(isUpvote ? "upvote" : "downvote");
      } else {
        console.error("Failed to vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const deleteVote = async () => {
    try {
      const res = await fetch(`/api/vote`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          votingType: "blog_post",
          votingId: blogId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBlog(data);
        setUserVote(null);
      } else {
        console.error("Failed to delete vote");
      }
    } catch (error) {
      console.error("Error deleting vote:", error);
    }
  };

  const handleBlogDelete = async () => {
    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (res.ok) {
        // Redirect to the home page
        router.push("/");
      } else {
        console.error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleBlogEdit = () => {
    if (blog && !isHidden) {
      router.push(`/blogs/edit/${blog.id}`);
    }
  };

  const handleVote = async (isUpvote: boolean) => {
    if (!isAuthenticated) {
      alert("You need to be logged in to vote");
      return;
    }

    if (userVote === "upvote" && isUpvote) {
      await deleteVote();
      setUserVote(null);
    } else if (userVote === "downvote" && !isUpvote) {
      await deleteVote();
      setUserVote(null);
    } else if (userVote === "upvote" && !isUpvote) {
      await deleteVote();
      await createVote(false);
      setUserVote("downvote");
    } else if (userVote === "downvote" && isUpvote) {
      await deleteVote();
      await createVote(true);
      setUserVote("upvote");
    } else {
      await createVote(isUpvote);
      setUserVote(isUpvote ? "upvote" : "downvote");
    }

    // Refresh the page after updating the vote
    window.location.reload();
  };

  const handleHideBlog = async () => {
    try {
      const res = await fetch(`/api/admin/hide?contentId=${blogId}&contentType=blog_post`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (res.ok) {
        setIsHidden(true);
      } else {
        console.error("Failed to hide blog");
      }
    } catch (error) {
      console.error("Error hiding blog:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-600 dark:text-gray-300">Blog not found</p>
      </div>
    );
  }

  if (isHidden && !isAuthor && !isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500">This blog is hidden and can only be viewed by the author.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <Header isAuthenticated={isAuthenticated} />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            {/* Blog Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 break-words">
              {blog.title}
            </h1>

            {/* Tags Section */}
            <div className="mb-6">
              {/* <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Tags</h2> */}
              <div className="flex flex-wrap gap-2">
                {blog.BlogPostTag &&
                  blog.BlogPostTag.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full bg-blue-500 text-white text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
              </div>
            </div>

            {/* Hidden Blog Warning */}
            {isHidden && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">This blog is being reported and is hidden.</span>
              </div>
            )}

            {/* Admin Hide Button */}
            {isAdmin && !isHidden && (
              <div className="mb-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                  onClick={handleHideBlog}
                >
                  Hide Post
                </button>
              </div>
            )}

            {/* Blog Content */}
            <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-6 mb-6">
              {/* Description */}
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{blog.description}</p>

              {/* Main Content */}
              <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 mb-4">
                {blog.content}
              </div>

              {/* Report Button */}
              <div className="mt-4">
                <button
                  className="text-blue-500 hover:text-blue-600 transition duration-300"
                  onClick={() => setShowReportForm(true)}
                >
                  Report Blog
                </button>
                {showReportForm && (
                  <ReportForm
                    onSubmit={handleReport}
                    onCancel={() => setShowReportForm(false)}
                  />
                )}
              </div>
            </div>

            {/* Voting Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <div className="flex space-x-4 mb-2 sm:mb-0">
                <button
                  className={`px-4 py-2 rounded transition duration-300 flex items-center space-x-2 ${userVote === "upvote"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-green-100"
                    }`}
                  onClick={() => handleVote(true)}
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                  <span>Upvote</span>
                </button>
                <button
                  className={`px-4 py-2 rounded transition duration-300 flex items-center space-x-2 ${userVote === "downvote"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-100"
                    }`}
                  onClick={() => handleVote(false)}
                >
                  <FontAwesomeIcon icon={faThumbsDown} />
                  <span>Downvote</span>
                </button>
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                <span>Upvotes: {blog.upVotes}</span>
                <span className="ml-4">Downvotes: {blog.downVotes}</span>
              </div>
            </div>



            {/* Edit and Delete Buttons */}
            {isAuthenticated && isAuthor && (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                {!isHidden && (
                  <button
                    className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    onClick={handleBlogEdit}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                  onClick={handleBlogDelete}
                >
                  Delete
                </button>
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-8">
              <CommentSection blogId={blogId as string} />
            </div>
          </div>

          {/* Sidebar for Code Templates */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-6 sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Related Code Templates</h2>
              {blog.likendTemp && blog.likendTemp.length > 0 ? (
                <ul className="space-y-2">
                  {blog.likendTemp.map((template) => (
                    <li
                      key={template.id}
                      className="bg-gray-100 dark:bg-gray-600 rounded p-3 hover:bg-gray-200 dark:hover:bg-gray-500 transition duration-300"
                    >
                      <span
                        className="text-blue-600 dark:text-blue-400 cursor-pointer block"
                        onClick={() => router.push(`/codeTemplates/${template.id}`)}
                      >
                        {template.title}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No code templates mentioned</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;