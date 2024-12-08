import React, { useState, useEffect, useMemo } from "react";
import { BlogPost } from "../../utils/types";
import Header from "@/components/header";
import BlogPostList from "@/components/blogpost";
import { useRouter } from "next/router";

const AllBlogPosts: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Separate state for form inputs and actual search params
  const [formInputs, setFormInputs] = useState({
    searchTitle: "",
    searchContent: "",
    searchDescription: "",
    searchTags: "",
    searchCodeTemplates: "",
    sortBy: "createdAt",
    page: 1,
    limit: 10,
  });

  const [activeSearchParams, setActiveSearchParams] = useState(formInputs);

  // Sync URL params to state only on initial load
  useEffect(() => {
    if (!router.isReady) return;

    const {
      searchTitle,
      searchContent,
      searchDescription,
      searchTags,
      searchCodeTemplates,
      sortBy,
      page,
      limit,
    } = router.query;

    const initialParams = {
      searchTitle: (searchTitle as string) || "",
      searchContent: (searchContent as string) || "",
      searchDescription: (searchDescription as string) || "",
      searchTags: (searchTags as string) || "",
      searchCodeTemplates: (searchCodeTemplates as string) || "",
      sortBy: (sortBy as string) || "createdAt",
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 10,
    };

    setFormInputs(initialParams);
    setActiveSearchParams(initialParams);
  }, [router.isReady]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  // Fetch blogs only when activeSearchParams changes
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        Object.entries(activeSearchParams).forEach(([key, value]) => {
          if (value !== "" && value !== undefined) {
            query.append(key, value.toString());
          }
        });

        const res = await fetch(`/api/blogs?${query}`);
        const data = await res.json();
        if (res.ok && data) {
          setBlogs(data);
        } else {
          console.error("Failed to fetch blogs");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
    // Update URL without page reload
    router.push(
      {
        pathname: router.pathname,
        query: activeSearchParams,
      },
      undefined,
      { shallow: true }
    );
  }, [activeSearchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      sortBy: value,
    }));
  };

  const handlePageChange = (newPage: number) => {
    const newParams = {
      ...activeSearchParams,
      page: newPage,
    };
    setFormInputs(newParams);
    setActiveSearchParams(newParams); // Immediately update for pagination
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setFormInputs((prev) => ({
        ...prev,
        limit: value,
      }));
    }
  };

  const handleSearch = () => {
    setActiveSearchParams({
      ...formInputs,
      page: 1, // Reset to first page on new search
    });
  };

  const handleReset = () => {
    const defaultParams = {
      searchTitle: "",
      searchContent: "",
      searchDescription: "",
      searchTags: "",
      searchCodeTemplates: "",
      sortBy: "createdAt",
      page: 1,
      limit: 10,
    };
    setFormInputs(defaultParams);
    setActiveSearchParams(defaultParams);
  };

  // Check if current form inputs differ from active search
  const hasChanges = useMemo(() => {
    return JSON.stringify(formInputs) !== JSON.stringify(activeSearchParams);
  }, [formInputs, activeSearchParams]);

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center">All Blog Posts</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            name="searchTitle"
            placeholder="Search by title"
            value={formInputs.searchTitle}
            onChange={handleInputChange}
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            name="searchContent"
            placeholder="Search by content"
            value={formInputs.searchContent}
            onChange={handleInputChange}
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            name="searchDescription"
            placeholder="Search by description"
            value={formInputs.searchDescription}
            onChange={handleInputChange}
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            name="searchTags"
            placeholder="Search by tags"
            value={formInputs.searchTags}
            onChange={handleInputChange}
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            name="searchCodeTemplates"
            placeholder="Search by code templates"
            value={formInputs.searchCodeTemplates}
            onChange={handleInputChange}
            className="border p-2 rounded-lg"
          />
          <div className="flex gap-2">
            <select
              name="sortBy"
              value={formInputs.sortBy}
              onChange={handleSortChange}
              className="border p-2 rounded-lg flex-1"
            >
              <option value="createdAt">Sort by Created At</option>
              <option value="value">Sort by Value</option>
              <option value="controversial">Sort by Controversial</option>
            </select>
            <input
              type="number"
              name="limit"
              placeholder="Items per page"
              value={formInputs.limit}
              onChange={handleLimitChange}
              className="border p-2 rounded-lg w-32"
              min="1"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={handleSearch}
            disabled={!hasChanges}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Reset Filters
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            <BlogPostList blogs={blogs} isManage={false} />
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(activeSearchParams.page - 1)}
                disabled={activeSearchParams.page === 1}
              >
                Previous
              </button>
              <p className="px-4 py-2 rounded">
                Page {activeSearchParams.page}
              </p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(activeSearchParams.page + 1)}
                disabled={blogs.length < activeSearchParams.limit}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBlogPosts;
