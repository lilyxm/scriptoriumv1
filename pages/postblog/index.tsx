import React, { useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/header";
import SearchCodeTemplateForBlogCreation from "@/components/SearchCodeTemplateForBlogCreation";

const PostBlog: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [templateIdInput, setTemplateIdInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCodeTemplates, setShowCodeTemplates] = useState(false);
  const router = useRouter();

  // Check if the user is authenticated
  React.useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || token === "null" || token === "undefined") {
      router.push("/signin");
    }
    setIsAuthenticated(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tags.split(",").map((tag) => tag.trim());

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          title,
          description,
          content,
          BlogPostTag: tagsArray,
          likendTemp: selectedTemplates,
        }),
      });

      if (res.ok) {
        alert("Blog post created successfully");
        router.push("/");
      } else {
        const errorData = await res.json();
        alert(`Failed to create blog post: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
      alert("An error occurred while creating the blog post");
    }
  };

  const handleTemplateIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateIdInput(e.target.value);
  };

  const handleAddTemplate = () => {
    const templateId = parseInt(templateIdInput, 10);
    if (!isNaN(templateId) && !selectedTemplates.includes(templateId)) {
      setSelectedTemplates([...selectedTemplates, templateId]);
      setTemplateIdInput("");
    }
  };

  const handleRemoveTemplate = (templateId: number) => {
    setSelectedTemplates(selectedTemplates.filter((id) => id !== templateId));
  };



  if (!isAuthenticated) {
    return (
      <div>
        <Header isAuthenticated={isAuthenticated} />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold">
            You need to be logged in to post a blog
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Post a New Blog</h1>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block   text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3   leading-tight focus:outline-none focus:shadow-outline"
              type="text"
            />
          </div>
          <div className="mb-4">
            <label
              className="block   text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3   leading-tight focus:outline-none focus:shadow-outline"
              type="text"
            />
          </div>
          <div className="mb-4">
            <label className="block   text-sm font-bold mb-2" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3   leading-tight focus:outline-none focus:shadow-outline"
              rows={10}
            />
          </div>
          <div className="mb-4">
            <label className="block   text-sm font-bold mb-2" htmlFor="tags">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3   leading-tight focus:outline-none focus:shadow-outline"
              type="text"
            />
          </div>
          <div className="mb-4">
            <label
              className="block   text-sm font-bold mb-2"
              htmlFor="templateId"
            >
              Add Code Template by ID
            </label>
            <div className="flex">
              <input
                id="templateId"
                value={templateIdInput}
                onChange={handleTemplateIdInput}
                className="shadow appearance-none border rounded w-full py-2 px-3   leading-tight focus:outline-none focus:shadow-outline"
                type="number"
              />
              <button
                type="button"
                onClick={handleAddTemplate}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
              >
                Add
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block   text-sm font-bold mb-2">
              Selected Code Templates
            </label>
            <ul>
              {selectedTemplates.map((templateId) => (
                <li
                  key={templateId}
                  className="flex items-center justify-between"
                >
                  <span>{templateId}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTemplate(templateId)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowCodeTemplates(!showCodeTemplates)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {showCodeTemplates ? "Hide" : "Show"} Code Templates
            </button>
            {showCodeTemplates && (
              <div className="mt-4">
                <SearchCodeTemplateForBlogCreation />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Post Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostBlog;
