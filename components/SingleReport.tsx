import React, { useEffect, useState } from "react";
import { Report, User, BlogPost, Comment } from "@/utils/types";
import { useRouter } from "next/router";
import BlogPostList from "@/components/blogpost";

interface SingleReportProps {
    reportId: number;
}

const SingleReport: React.FC<SingleReportProps> = ({ reportId }) => {
    const [report, setReport] = useState<(Report & { reportedBy: User }) | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
    const [comment, setComment] = useState<Comment | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch(`/api/admin/${reportId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch report");

                const data = await res.json();
                setReport(data.report);

                if (data.report.reportingType === "blog_post") {
                    const blogRes = await fetch(
                        `/api/blogs/${data.report.reportingID}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                            },
                        }
                    );

                    if (!blogRes.ok) throw new Error("Failed to fetch blog post");

                    const blogPostData = await blogRes.json();
                    setBlogPost(blogPostData);
                } else if (data.report.reportingType === "comment") {
                    const commentRes = await fetch(
                        `/api/admin/comments/${data.report.reportingID}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                            },
                        }
                    );

                    if (!commentRes.ok) throw new Error("Failed to fetch comment");

                    const commentData = await commentRes.json();
                    setComment(commentData);
                }
            } catch (error) {
                console.error("Error fetching report:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [reportId]);

    const handleHideReport = async () => {
        try {
            const res = await fetch(`/api/admin/${reportId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (!res.ok) throw new Error("Failed to hide report");

            alert("Report hidden successfully");
            router.reload();
        } catch (error) {
            console.error("Error hiding report:", error);
            alert("Failed to hide report");
        }
    };

    const handleDeleteReport = async () => {
        try {
            const res = await fetch(`/api/admin/${reportId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (!res.ok) throw new Error("Failed to delete report");

            alert("Report deleted successfully");
            router.push("/admin/reports"); // Redirect to reports list after deletion
        } catch (error) {
            console.error("Error deleting report:", error);
            alert("Failed to delete report");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-700 dark:text-gray-200">Loading...</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-700 dark:text-gray-200">No report found</p>
            </div>
        );
    }

    const handleNavigateToBlog = () => {
        router.push(`/blogs/${report.reportingID}`);
    };

    const handleNavigateToComment = async () => {
        try {
            const res = await fetch(
                `/api/users/findComment?commentId=${report.reportingID}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Failed to fetch blog post for comment");

            const commentDetails = await res.json();
            router.push(`/blogs/${commentDetails.comment.blogPostId}`);
        } catch (error) {
            console.error("Error fetching comment details:", error);
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
                Report Details
            </h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
                    Reason: <span className="font-normal">{report.reason}</span>
                </p>
                <div className="text-center">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Reported By:</strong> {report.reportedBy.username}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Created At:</strong>{" "}
                        {new Date(report.createdAt).toLocaleString()}
                    </p>
                </div>

                {/* Blog Post Report */}
                {report.reportingType === "blog_post" && blogPost && (
                    <>
                        <BlogPostList blogs={[blogPost]} isManage={false} />
                        <div className="flex justify-center gap-6 mt-8">
                            <button
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400"
                                onClick={handleNavigateToBlog}
                            >
                                View Blog Post Details
                            </button>
                            {blogPost.ishidden ? (
                                <p className="text-red-500 font-semibold mt-3">
                                    This blog post is already hidden.
                                </p>
                            ) : (
                                <button
                                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-400"
                                    onClick={handleHideReport}
                                >
                                    Hide Reported Content
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* Comment Report */}
                {report.reportingType === "comment" && comment && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Comment Context
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {comment.content}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            By User {comment.authorId} on{" "}
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex justify-center gap-6 mt-8">
                            <button
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400"
                                onClick={handleNavigateToComment}
                            >
                                View Comment Context
                            </button>
                            {comment.ishidden ? (
                                <p className="text-red-500 font-semibold mt-3">
                                    This comment is already hidden.
                                </p>
                            ) : (
                                <button
                                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-400"
                                    onClick={handleHideReport}
                                >
                                    Hide Reported Content
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Delete Report */}
                <div className="flex justify-center mt-10">
                    <button
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-500"
                        onClick={handleDeleteReport}
                    >
                        Delete Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SingleReport;
