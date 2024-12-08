import React, { useState, useEffect } from "react";
import Header from "@/components/header";
import { CodeTemplate } from "@/utils/types";
import CodeTemplateList from "@/components/codetemplate";

const AllCodeTemplates: React.FC = () => {
  const [codeTemplates, setCodeTemplates] = useState<CodeTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [searchParams, setSearchParams] = useState({
    searchTitle: "",
    searchDescription: "",
    searchContent: "",
    searchTags: "",

    page: 1,
    limit: 10,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token === undefined || token === null || token === "undefined") {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(!!token);
    }
  }, []);

  useEffect(() => {
    const fetchCodeTemplates = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams({
          title: searchParams.searchTitle,
          description: searchParams.searchDescription,
          content: searchParams.searchContent,
          page: searchParams.page.toString(),
          pageSize: searchParams.limit.toString(),
        }).toString();
        const res = await fetch(`/api/code/templates?${query}`);
        const data = await res.json();
        if (res.ok && data) {
          console.log("Data:", data.codeTemplates);
          setCodeTemplates(data.codeTemplates);
          setTotalTemplates(data.totalTemplates);
        } else {
          console.error("Failed to fetch code templates");
        }
      } catch (error) {
        console.error("Error fetching code templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCodeTemplates();
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
      page: 1, // Reset page to 1 on search parameter change
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setSearchParams((prevParams) => ({
      ...prevParams,
      page: newPage,
    }));
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const limit = parseInt(value, 10);
    if (limit < 1) return;
    setSearchParams((prevParams) => ({
      ...prevParams,
      limit,
      page: 1, // Reset page to 1 on limit change
    }));
  };

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center">All Code Templates</h1>
        <div className="mt-4">
          <input
            type="text"
            name="searchTitle"
            placeholder="Search by title"
            value={searchParams.searchTitle}
            onChange={handleInputChange}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            name="searchDescription"
            placeholder="Search by description"
            value={searchParams.searchDescription}
            onChange={handleInputChange}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            name="searchContent"
            placeholder="Search by content"
            value={searchParams.searchContent}
            onChange={handleInputChange}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            name="limit"
            placeholder="Items per page"
            value={searchParams.limit}
            onChange={handleLimitChange}
            className="border p-2 ml-2"
            min="1"
          />
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <ul className="mt-4">
              <CodeTemplateList
                codeTemplates={codeTemplates}
                isManage={false}
              />
            </ul>
            <p className="mt-4 text-right">
              Total Code Templates: {totalTemplates}
            </p>
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
                disabled={codeTemplates.length < searchParams.limit}
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

export default AllCodeTemplates;
