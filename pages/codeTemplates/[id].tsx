import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/header";
import CodeEditor from "@/components/CodeEditor/codeEditor";
import { CodeTemplate } from "@/utils/types";
import { tagColors } from "@/utils/color";
import LinkedBlogs from "@/components/CodeEditor/linkedblogs";
const CodeTemplateDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [template, setTemplate] = useState<CodeTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    if (template) {
      const userId = parseInt(localStorage.getItem("userID") || "0");
      if (userId && template.authorId === userId) {
        setIsAuthor(true);
      } else {
        setIsAuthor(false);
      }
    }
  }, [template]);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = parseInt(localStorage.getItem("userID") || "-1");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      const fetchTemplate = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/code/templates/${id}`, {
            method: "GET",
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          });
          const data = await res.json();
          console.log("Data:", data);
          if (res.ok && data) {
            setTemplate(data.template);
          } else {
            console.error("Failed to fetch template");
          }
        } catch (error) {
          console.error("Error fetching template:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTemplate();
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!template) {
    return <div>Template not found</div>;
  }

  async function handleDeleteCodeTemplate(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();
    const confirmDelete = confirm(
      "Are you sure you want to delete this template?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/code/templates/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        alert("Template deleted successfully");
        router.push("/codeTemplates");
      } else {
        console.error("Failed to delete template");
        alert("Failed to delete template");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Error deleting template");
    }
  }
  const userId = parseInt(localStorage.getItem("userID") || "0");

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h1 className="text-4xl font-bold">Title: {template.title}</h1>
            <p className="text-gray-600">Description: {template.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-start justify-end">
            {template.CodeTemplateTag.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 rounded-full text-white"
                style={{
                  backgroundColor: tagColors[tag.id % tagColors.length],
                }}
              >
                {tag.name}
              </span>
            ))}
            <div className="ml-20">
              <LinkedBlogs blogPosts={template.BlogPost} />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <CodeEditor
            template={template}
            id={userId}
            isAuthor={isAuthor}
            mode="view"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeTemplateDetails;
