import React, { useState, useEffect } from "react";
import { BlogPost } from "@/utils/types";
import BlogPostList from "@/components/blogpost";

interface SearchBlogsProps {
  isManage: boolean;
}

const SearchBlogs: React.FC<SearchBlogsProps> = ({ isManage }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    manage: "blog",
    searchTitle: "",
    searchContent: "",
    searchDescription: "",
    searchTags: "",
    searchCodeTemplates: "",
    sortBy: "createdAt",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        var query = new URLSearchParams({
          ...searchParams,
          page: searchParams.page.toString(),
          limit: searchParams.limit.toString(),
        }).toString();
        let res;
        if (isManage) {
          const token = localStorage.getItem("authToken");
          res = await fetch(`/api/users/getOwnBlogs?${query}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          res = await fetch(`/api/blogs?${query}`);
        }
        const data = await res.json();
        if (res.ok && data) {
          setBlogs(data);
          console.log("Fetched blogs:", data);
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
  }, [searchParams]);

  useEffect(() => {
    const query = new URLSearchParams({
      ...searchParams,
      page: searchParams.page.toString(),
      limit: searchParams.limit.toString(),
    }).toString();
    window.history.pushState(null, "", `?${query}`);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams({
      manage: "blog",
      searchTitle: params.get("searchTitle") || "",
      searchContent: params.get("searchContent") || "",
      searchDescription: params.get("searchDescription") || "",
      searchTags: params.get("searchTags") || "",
      searchCodeTemplates: params.get("searchCodeTemplates") || "",
      sortBy: params.get("sortBy") || "createdAt",
      page: parseInt(params.get("page") || "1", 10),
      limit: parseInt(params.get("limit") || "10", 10),
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      page: newPage,
    }));
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      limit: parseInt(value, 10),
    }));
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {" "}
          <input
            type="text"
            name="searchTitle"
            placeholder="Search by title"
            value={searchParams.searchTitle}
            onChange={handleInputChange}
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            name="searchContent"
            placeholder="Search by content"
            value={searchParams.searchContent}
            onChange={handleInputChange}
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            name="searchDescription"
            placeholder="Search by description"
            value={searchParams.searchDescription}
            onChange={handleInputChange}
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            name="searchTags"
            placeholder="Search by tags"
            value={searchParams.searchTags}
            onChange={handleInputChange}
            className="border p-2 rounded-lg"
          />
          <input
            type="text"
            name="searchCodeTemplates"
            placeholder="Search by code templates"
            value={searchParams.searchCodeTemplates}
            onChange={handleInputChange}
            className="border p-2 rounded-lg"
          />
          <div className="flex gap-2">
            {" "}
            <select
              name="sortBy"
              value={searchParams.sortBy}
              onChange={handleSortChange}
              className="border p-2 rounded-lg flex-1"
            >
              {" "}
              <option value="createdAt">Sort by Created At</option>{" "}
              <option value="value">Sort by Value</option>{" "}
              <option value="controversial">Sort by Controversial</option>{" "}
            </select>{" "}
            <input
              type="number"
              name="limit"
              placeholder="Items per page"
              value={searchParams.limit}
              onChange={handleLimitChange}
              className="border p-2 rounded-lg w-32"
              min="1"
            />
          </div>
        </div>{" "}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <ul className="mt-4">
              <BlogPostList blogs={blogs} isManage={isManage} />
            </ul>
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                onClick={() => handlePageChange(searchParams.page - 1)}
                disabled={searchParams.page === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2">{searchParams.page}</span>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
                onClick={() => handlePageChange(searchParams.page + 1)}
                disabled={blogs.length < searchParams.limit}
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

export default SearchBlogs;
