import React, { useState, useEffect } from "react";
import CodeTemplateList from "./codetemplate";
import { useRouter } from "next/router";
import { refreshToken } from "@/utils/refresh";

interface SearchParams {
  searchTitle: string;
  searchDescription: string;
  searchContent: string;
  searchTags: string;
  limit: number;
  page: number;
}

interface SearchCodeTemplatesProps {
  isManage: boolean;
}

const SearchCodeTemplates: React.FC<SearchCodeTemplatesProps> = ({
  isManage,
}) => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    searchTitle: "",
    searchDescription: "",
    searchContent: "",
    searchTags: "",
    limit: 10,
    page: 1,
  });

  const [codeTemplates, setCodeTemplates] = useState([]);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
        var query = new URLSearchParams({
          title: searchParams.searchTitle,
          description: searchParams.searchDescription,
          content: searchParams.searchContent,
          page: searchParams.page.toString(),
          pageSize: searchParams.limit.toString(),
        }).toString();
        if (isManage) {
          const { id } = router.query;
          query += `&authorId=${id}`;
          console.log("Query:", query);
          router.push(`/user/${id}/manage?manage=code&${query}`);
        } else {
          console.log("Query:", query);

          router.push(`/codeTemplates?${query}`);
        }
        let res;
        if (isManage) {
          res = await fetch(`/api/code/templates?${query}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
        } else {
          res = await fetch(`/api/code/templates?${query}`);
        }
        const data = await res.json();
        if (res.ok && data) {
          if (isManage) {
            const { id } = router.query;
            // query += `&authorId=${id}`;
            console.log("Query:", query);
            router.push(`/user/${id}/manage?manage=code&${query}`);
          } else {
            console.log("Query:", query);

            router.push(`/codeTemplates?${query}`);
          }
          console.log("Data:", data.codeTemplates);
          setCodeTemplates(data.codeTemplates);
          setTotalTemplates(data.totalTemplates);
        } else {
          if (res.status === 402) {
            refreshToken();
          }
          if (res.status === 401) {
            alert("You are not authorized to view this page");
          }
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
    const newParams = {
      ...searchParams,
      [name]: value,
      page: 1, // Reset page to 1 on search parameter change
    };
    setSearchParams(newParams);
    console.log("change");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    const newParams = {
      ...searchParams,
      page: newPage,
    };
    setSearchParams(newParams);
    console.log("change");
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const limit = parseInt(value, 10);
    if (limit < 1) return;
    const newParams = {
      ...searchParams,
      limit,
      page: 1, // Reset page to 1 on limit change
    };
    setSearchParams(newParams);

    console.log("change");
  };

  return (
    <div>
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
          type="text"
          name="searchTags"
          placeholder="Search by Tags(commas separated)"
          value={searchParams.searchTags}
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
              isManage={isManage}
            />
          </ul>
          <p className="mt-4 text-right">
            Total Code Templates: {totalTemplates}
          </p>
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
              onClick={() => handlePageChange(searchParams.page - 1)}
              disabled={searchParams.page === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2">{searchParams.page}</span>
            <button
              type="button"
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
  );
};

export default SearchCodeTemplates;
