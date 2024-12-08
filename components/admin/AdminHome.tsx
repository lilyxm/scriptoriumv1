import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Report } from "@/utils/types";
import Header from "@/components/header";

const AdminHome: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [reports, setReports] = useState<Report[]>([]);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const userRole = localStorage.getItem("userRole");

        if (token) {
            setIsAuthenticated(true);
            if (userRole === "ADMIN") {
                setIsAdmin(true);
                fetchReports();
            } else {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userRole");
                router.push("/signin");
            }
        } else {
            router.push("/signin");
        }
    }, [router]);

    const fetchReports = async () => {
        try {
            const res = await fetch("/api/admin/reports", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch reports");
            }

            const data = await res.json();
            setReports(data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    if (!isAuthenticated || !isAdmin) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-700 dark:text-gray-200">Loading...</p>
            </div>
        );
    }

    const handleViewBlogs = () => {
        router.push("/admin/blogs");
    };

    const handleViewComments = () => {
        router.push("/admin/comments");
    };

    return (
        <div>
            <div className="container mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Reports Section */}
                <div className="col-span-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                        All Reports
                    </h1>
                    <div className="space-y-6">
                        {reports.length > 0 ? (
                            reports.map((report) => (
                                <div
                                    key={report.id}
                                    className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 shadow"
                                >
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>ID:</strong> {report.id}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>Reason:</strong> {report.reason}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>Reported By:</strong> {report.reportedBy.username}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>Type:</strong> {report.reportingType}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>Created At:</strong>{" "}
                                        {new Date(report.createdAt).toLocaleString()}
                                    </p>
                                    <button
                                        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 dark:hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        onClick={() =>
                                            router.push(`/admin/reports/${report.id}`)
                                        }
                                    >
                                        View Report
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400">
                                No reports found
                            </p>
                        )}
                    </div>
                </div>

                {/* Sidebar for Blogs and Comments */}
                <aside className="col-span-1">
                    <div className="space-y-6">
                        <button
                            onClick={handleViewBlogs}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            View All Blogs
                        </button>
                        <button
                            onClick={handleViewComments}
                            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            View All Comments
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default AdminHome;
