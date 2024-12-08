import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/header";
import SearchCodeTemplateForBlogCreation from "@/components/SearchCodeTemplateForBlogCreation";

const EditBlog: React.FC = () => {
    const router = useRouter();
    const { blogId } = router.query;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
    const [templateIdInput, setTemplateIdInput] = useState("");
    const [showCodeTemplates, setShowCodeTemplates] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!blogId) return;
            try {
                const res = await fetch(`/api/blogs/${blogId}`);
                const data = await res.json();
                if (res.ok && data) {
                    setTitle(data.title);
                    setDescription(data.description);
                    setContent(data.content);
                    setTags(
                        data.BlogPostTag.map((tag: { name: string }) => tag.name).join(", ")
                    );
                    setSelectedTemplates(
                        data.likendTemp.map((template: { id: number }) => template.id)
                    );

                    const userID = localStorage.getItem("userID");
                    if (userID && data.authorId === parseInt(userID)) {
                        setIsAuthor(true);
                    } else {
                        alert("You are not authorized to edit this blog post.");
                        router.push(`/blogs/${blogId}`);
                    }
                } else {
                    console.error("Failed to fetch blog");
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlog();
    }, [blogId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const tagsArray = tags.split(",").map((tag) => tag.trim());

        try {
            const res = await fetch(`/api/blogs/${blogId}`, {
                method: "PUT",
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
                alert("Blog post updated successfully");
                router.push(`/blogs/${blogId}`);
            } else {
                const errorData = await res.json();
                alert(`Failed to update blog post: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating blog post:", error);
            alert("An error occurred while updating the blog post");
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

    if (isLoading) {
        return <p className="text-gray-700 dark:text-gray-200">Loading...</p>;
    }

    if (!isAuthor) {
        return null;
    }

    return (
        <div>
            <Header isAuthenticated={true} />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Edit Blog
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
                >
                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            htmlFor="title"
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            htmlFor="description"
                        >
                            Description
                        </label>
                        <input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            htmlFor="content"
                        >
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={8}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            htmlFor="tags"
                        >
                            Tags (comma separated)
                        </label>
                        <input
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            htmlFor="templateId"
                        >
                            Add Code Template by ID
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                id="templateId"
                                value={templateIdInput}
                                onChange={handleTemplateIdInput}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="number"
                            />
                            <button
                                type="button"
                                onClick={handleAddTemplate}
                                className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Selected Code Templates
                        </label>
                        <ul className="space-y-2">
                            {selectedTemplates.map((templateId) => (
                                <li
                                    key={templateId}
                                    className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-lg"
                                >
                                    <span className="text-gray-800 dark:text-gray-200">
                                        {templateId}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTemplate(templateId)}
                                        className="bg-red-500 text-white font-medium px-2 py-1 rounded-lg hover:bg-red-600 dark:hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                            className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {showCodeTemplates ? "Hide" : "Show"} Code Templates
                        </button>
                        {showCodeTemplates && (
                            <div className="mt-4">
                                <SearchCodeTemplateForBlogCreation />
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Update Blog
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditBlog;
