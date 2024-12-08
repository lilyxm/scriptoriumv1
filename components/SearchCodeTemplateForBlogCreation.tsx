import React, { useState, useEffect } from "react";
import CodeTemplateList from "./codetemplate";

interface SearchParams {
  searchTitle: string;
  limit: number;
  page: number;
}

const SearchCodeTemplateForBlogCreation: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    searchTitle: "",
    limit: 5,
    page: 1,
  });

  const [codeTemplates, setCodeTemplates] = useState([]);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCodeTemplates = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams({
          title: searchParams.searchTitle,
          page: searchParams.page.toString(),
          pageSize: searchParams.limit.toString(),
        }).toString();

        console.log("Query:", query);
        const res = await fetch(`/api/code/templates?${query}`, {
          method: "GET",
        });

        const data = await res.json();
        console.log(data);

        if (res.ok && data) {
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
    setSearchParams((prevParams: any) => ({
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
            <CodeTemplateList codeTemplates={codeTemplates} isManage={false} />
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

export default SearchCodeTemplateForBlogCreation;
