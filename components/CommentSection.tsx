import React, { useEffect, useState } from "react";
import CommentForm from "@/components/CommentForm";
import SingleComment from "./SingleComment";
import { Comment } from "../utils/types";

interface CommentSectionProps {
    blogId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const [newComment, setNewComment] = useState("");
    const [replyToID, setReplyToID] = useState<number | null>(null);
    const [replyToType, setReplyToType] = useState<"blog_post" | "comment">(
        "blog_post"
    );
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const userID = localStorage.getItem("userID");
        if (token && userID) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        const fetchComments = async () => {
            if (!blogId) return;
            setIsLoading(true);
            try {
                const res = await fetch(`/api/blogs/${blogId}/comments`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (res.ok && data) {
                    setComments(data);
                } else {
                    console.error("Failed to fetch comments");
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [blogId]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await fetch(`/api/blogs/${blogId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({
                    content: newComment,
                    replyToID: replyToID || blogId,
                    replyToType: replyToType,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setComments([...comments, data]);
                setNewComment("");
                setReplyToID(null);
                setReplyToType("blog_post");
                setShowForm(false);
            } else {
                console.error("Failed to post comment");
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    const handleReplyClick = (commentId: number) => {
        if (!isAuthenticated) {
            alert("Please log in to comment");
            return;
        }
        setReplyToID(commentId);
        setReplyToType("comment");
        setShowForm(true);
    };

    const handleCommentClick = () => {
        if (!isAuthenticated) {
            alert("Please log in to comment");
            return;
        }
        setReplyToID(null);
        setReplyToType("blog_post");
        setShowForm(true);
    };

    const renderBlogPostComments = (comments: Comment[]) => {
        return comments
            .filter((comment) => comment.replyToType === "blog_post")
            .map((comment) => (
                <li key={comment.id} className="mb-6">
                    <SingleComment comment={comment} blogId={blogId} />
                    <button
                        className="text-sm text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-2"
                        onClick={() => handleReplyClick(comment.id)}
                    >
                        Reply
                    </button>
                    {showForm && replyToID === comment.id && (
                        <div className="mt-4">
                            <CommentForm
                                newComment={newComment}
                                setNewComment={setNewComment}
                                handleCommentSubmit={handleCommentSubmit}
                                setShowForm={setShowForm}
                            />
                        </div>
                    )}
                    <ul className="pl-6 mt-2">
                        {renderCommentReplies(comments, comment.id)}
                    </ul>
                </li>
            ));
    };

    const renderCommentReplies = (comments: Comment[], parentId: number) => {
        return comments
            .filter(
                (comment) =>
                    comment.replyToID === parentId && comment.replyToType === "comment"
            )
            .map((comment) => (
                <li key={comment.id} className="mb-4">
                    <SingleComment comment={comment} blogId={blogId} />
                    <button
                        className="text-sm text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-2"
                        onClick={() => handleReplyClick(comment.id)}
                    >
                        Reply
                    </button>
                    {showForm && replyToID === comment.id && (
                        <div className="mt-4">
                            <CommentForm
                                newComment={newComment}
                                setNewComment={setNewComment}
                                handleCommentSubmit={handleCommentSubmit}
                                setShowForm={setShowForm}
                            />
                        </div>
                    )}
                    {/* Remove bullet point for replies */}
                    <ul className="pl-6 mt-2">
                        {renderCommentReplies(comments, comment.id)}
                    </ul>
                </li>
            ));
    };

    const renderComments = (comments: Comment[]) => {
        return (
            <ul className="list-none">
                {renderBlogPostComments(comments)}
            </ul>
        );
    };

    return (
        <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Comments
            </h2>
            {isLoading ? (
                <p className="text-gray-500 dark:text-gray-400">Loading comments...</p>
            ) : (
                <ul>{renderComments(comments)}</ul>
            )}
            <button
                className="block mt-4 text-sm text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={handleCommentClick}
            >
                Add a Comment
            </button>
            {showForm && replyToType === "blog_post" && (
                <div className="mt-4">
                    <CommentForm
                        newComment={newComment}
                        setNewComment={setNewComment}
                        handleCommentSubmit={handleCommentSubmit}
                        setShowForm={setShowForm}
                    />
                </div>
            )}
        </div>
    );
};

export default CommentSection;
