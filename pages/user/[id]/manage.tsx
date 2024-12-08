import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import ManageHeader from "@/components/codeblogcommenthdr";
import { useRouter } from "next/router";
import { User } from "@/utils/types";
import SearchCodeTemplates from "@/components/searchCodeTemplates";
import SearchBlogs from "@/components/searchBlogs";

const ManageUserPage: React.FC = () => {
  const router = useRouter();
  const { id, manage } = router.query;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} />
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-center text-3xl md:text-4xl font-bold my-6 text-gray-800 dark:text-gray-200">
          Manage My {manage}
        </h1>

        {/* Navigation Header */}
        <ManageHeader current={typeof manage === "string" ? manage : ""} />

        {/* Manage Code Templates */}
        {manage === "code" && (
          <section className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                My Code Templates
              </h2>
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 dark:hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onClick={() => (window.location.href = "/codeTemplates/new")}
              >
                + Create New Code Template
              </button>
            </div>
            <SearchCodeTemplates isManage={true} />
          </section>
        )}

        {/* Manage Blog Posts */}
        {manage === "blog" && (
          <section className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                My Blog Posts
              </h2>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => (window.location.href = "/postblog")}
              >
                + Create New Blog Post
              </button>
            </div>
            <SearchBlogs isManage={true} />
          </section>
        )}
      </main>
    </div>
  );
};

export default ManageUserPage;
