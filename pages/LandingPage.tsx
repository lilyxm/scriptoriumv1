import React, { useState, useEffect } from "react";
import { BlogPost, CodeTemplate } from "../utils/types";
import Header from "@/components/header";
import CodeTemplateList from "@/components/codetemplate";
import BlogPostList from "@/components/blogpost";
import AdminHome from "../components/admin/AdminHome";

const LandingPage: React.FC = () => {
  const [topBlogs, setTopBlogs] = useState<BlogPost[]>([]);
  const [topCodeTemplates, setTopCodeTemplates] = useState<CodeTemplate[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    setUserRole(userRole ?? "visitor");
    if (token === undefined || token === null || token === "undefined") {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(!!token);
    }

    // Fetch top blog posts
    const fetchTopBlogs = async () => {
      try {
        const res = await fetch("/api/blogs?sortBy=value&limit=5");
        const data = await res.json();
        if (res.ok && data) {
          setTopBlogs(data);
        } else {
          console.error("Failed to fetch top blogs");
        }
      } catch (error) {
        console.error("Error fetching top blogs:", error);
      }
    };

    // Fetch top code templates
    const fetchTopCodeTemplates = async () => {
      try {
        const res = await fetch("/api/code/templates?page=1&pageSize=5");
        const data = await res.json();
        if (res.ok && data) {
          setTopCodeTemplates(data.codeTemplates);
        } else {
          console.error("Failed to fetch top code templates");
        }
      } catch (error) {
        console.error("Error fetching top code templates:", error);
      }
    };

    fetchTopBlogs();
    fetchTopCodeTemplates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      <Header isAuthenticated={isAuthenticated} />
      {userRole === 'ADMIN' ? (
        <AdminHome />
      ) : (
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Scriptorium</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Your one-stop platform for blogs and code templates
          </p>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 mx-auto max-w-lg">
            <h2 className="text-2xl font-semibold mb-4">Create</h2>
            <div className="flex flex-col space-y-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                onClick={() => (window.location.href = "/postblog")}
              >
                Create New Blog Post
              </button>
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-200"
                onClick={() => (window.location.href = "/codeTemplates/new")}
              >
                Try Our Code Editor
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Top Blog Posts</h2>
              <ul className="space-y-4">
                <BlogPostList blogs={topBlogs} isManage={false} />
              </ul>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                onClick={() => (window.location.href = "/blogs")}
              >
                View All Blog Posts
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Top Code Templates</h2>
              <ul className="space-y-4">
                <CodeTemplateList codeTemplates={topCodeTemplates} isManage={false} />
              </ul>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                onClick={() => (window.location.href = "/codeTemplates")}
              >
                View All Code Templates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;