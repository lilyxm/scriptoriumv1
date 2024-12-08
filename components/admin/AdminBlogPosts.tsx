import React, { useState, useEffect } from "react";
import { BlogPost } from "@/utils/types";
import BlogPostList from "@/components/blogpost";

const AdminBlogPosts: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState("createdAt");

    useEffect(() => {
        const fetchBlogs = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(
                    `/api/admin/blogs?page=${page}&pageSize=${pageSize}&sortByReports=${sortBy === "reportsCount"
                    }`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch blogs");
                }

                const data = await res.json();
                setBlogs(data.blogs);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, [page, pageSize, sortBy]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPageSize(parseInt(e.target.value));
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-700 dark:text-gray-200">Loading...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                Admin Blog Posts
            </h1>

            {/* Controls Section */}
            <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Sort By */}
                <div>
                    <label
                        htmlFor="sortBy"
                        className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
                    >
                        Sort by:
                    </label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={handleSortChange}
                        className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-gray-200"
                    >
                        <option value="createdAt">Created Time</option>
                        <option value="reportsCount">Reports Count</option>
                    </select>
                </div>

                {/* Page Size */}
                <div>
                    <label
                        htmlFor="pageSize"
                        className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
                    >
                        Page Size:
                    </label>
                    <input
                        id="pageSize"
                        type="number"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        min={1}
                        className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-gray-200"
                    />
                </div>
            </div>

            {/* Blog List */}
            <BlogPostList blogs={blogs} isManage={false} />

            {/* Pagination */}
            <div className="mt-6 flex justify-center items-center gap-4">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded ${page === 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                >
                    Previous
                </button>
                <span className="text-gray-700 dark:text-gray-200">
                    Page {page}
                </span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminBlogPosts;
