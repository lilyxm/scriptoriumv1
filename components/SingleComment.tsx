import React, { useEffect, useState } from "react";
import { Comment } from "../utils/types";
import ReportForm from "./ReportFrom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

interface SingleCommentProps {
  blogId: string;
  comment: Comment;
}

const SingleComment: React.FC<SingleCommentProps> = ({ blogId, comment }) => {
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    setIsAuthenticated(!!token);
    setIsAdmin(userRole === "ADMIN");

    console.log("comment", comment);

    const fetchUserVote = async () => {
      if (!blogId || !token) return;
      try {
        const res = await fetch(
          `/api/vote/findVote?votingId=${comment.id}&votingType=comment`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.message === "Vote not found") {
          setUserVote(null);
          console.log("userVote", userVote);
        } else if (res.ok && data) {
          setUserVote(data.isUpVote ? "upvote" : "downvote");
          console.log("userVote", userVote);
        }
      } catch (error) {
        console.error("Error fetching user vote:", error);
      }
    };

    fetchUserVote();
  }, [blogId, comment.id]);

  const handleHideComment = async () => {
    try {
      const res = await fetch(
        `/api/admin/hide?contentId=${comment.id}&contentType=comment`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (res.ok) {
        alert("Comment hidden successfully");
      } else {
        console.error("Failed to hide comment");
      }
    } catch (error) {
      console.error("Error hiding comment:", error);
    }
    // refresh page
    window.location.reload();
  };

  const handleVote = async (isUpvote: boolean) => {
    if (!isAuthenticated) {
      alert("You need to be logged in to vote");
      return;
    }

    try {
      const res = await fetch(`/api/vote`, {
        method: userVote ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          isUpvote,
          votingType: "comment",
          votingId: comment.id,
        }),
      });

      if (res.ok) {
        setUserVote(userVote === "upvote" && isUpvote ? null : isUpvote ? "upvote" : "downvote");
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
    // refresh page
    window.location.reload();
  };

  const handleReport = async (reason: string) => {
    if (!isAuthenticated) {
      alert("You need to be logged in to report a comment");
      return;
    }

    try {
      const res = await fetch(
        `/api/blogs/${blogId}/comments/${comment.id}/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (res.ok) {
        alert("Comment reported successfully");
      } else {
        console.error("Failed to report comment");
      }
    } catch (error) {
      console.error("Error reporting comment:", error);
    } finally {
      setShowReportForm(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4 relative">
      {/* Report Button */}
      <button
        className="absolute top-2 right-2 text-sm text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
        onClick={() => setShowReportForm(true)}
      >
        Report
      </button>

      {/* Comment Content */}
      <p className="text-gray-700 dark:text-gray-200 text-base mb-2">
        {comment.content}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        By <span className="font-medium">{comment.author.username}</span> on{" "}
        {new Date(comment.createdAt).toLocaleDateString()}
      </p>

      {/* Voting Section */}
      <div className="flex items-center gap-4 mt-2">
        <button
          className={`text-lg ${userVote === "upvote"
            ? "text-green-500"
            : "text-gray-500 hover:text-green-500 dark:hover:text-green-400"
            }`}
          onClick={() => handleVote(true)}
        >
          <FontAwesomeIcon icon={faThumbsUp} />
        </button>
        <span className="text-gray-700 dark:text-gray-200">{comment.upVotes}</span>
        <button
          className={`text-lg ${userVote === "downvote"
            ? "text-red-500"
            : "text-gray-500 hover:text-red-500 dark:hover:text-red-400"
            }`}
          onClick={() => handleVote(false)}
        >
          <FontAwesomeIcon icon={faThumbsDown} />
        </button>
        <span className="text-gray-700 dark:text-gray-200">{comment.downVotes}</span>
      </div>

      {/* Admin Section */}
      {isAdmin && (
        <div className="absolute bottom-2 right-2">
          {comment.ishidden ? (
            <p className="text-sm text-red-500 font-semibold">This comment is hidden.</p>
          ) : (
            <button
              className="text-sm px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-400"
              onClick={handleHideComment}
            >
              Hide
            </button>
          )}
        </div>
      )}

      {/* Report Form */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-96">
            <ReportForm
              onSubmit={handleReport}
              onCancel={() => setShowReportForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleComment;
