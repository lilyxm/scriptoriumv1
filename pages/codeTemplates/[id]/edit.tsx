import React, { useState } from "react";
import header from "@/components/header";
import { useEffect } from "react";
import Header from "@/components/header";
import { useRouter } from "next/router";
import CodeEditor from "@/components/CodeEditor/codeEditor";
import { refreshToken } from "@/utils/refresh";
import { tagColors } from "@/utils/color";
const EditCodeTemplatePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [template, setTemplate] = useState<any>({});
  const [isAuthor, setIsAuthor] = useState(false);

  const [title, setTitle] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleRunCode = () => {
    // Implement code running logic here
    console.log("Running code...");
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      if (id) {
        const response = await fetch(`/api/code/templates/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTemplate(data.template);

          console.log("Data:", data);

          console.log(title, description, language, code, tags);
        } else {
          console.error("Failed to fetch template");
        }
      }
    };

    fetchTemplate();
  }, [id]);

  useEffect(() => {
    if (template) {
      const userId = parseInt(localStorage.getItem("userID") || "0");
      console.log("User ID:", userId);
      if (userId && template.authorId === userId) {
        console.log("Author ID:", template.authorId);

        setIsAuthor(true);
      } else {
        console.log("template", template);
        console.log("Author ID: false", template.authorId);

        setIsAuthor(false);
      }
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/code/templates/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ title, description, language, code, tags }),
    });

    if (response.ok) {
      alert("Template has been saved successfully.");
      const data = await response.json();
      console.log("Data:", data);
      window.location.href = `/codeTemplates/${data.updatedTemplate.id}`;
      console.log("Template saved successfully");
    } else {
      if (response.status === 401 || response.status === 403) {
        alert(
          "You need to sign in to save the template. " +
            response.status +
            ": " +
            response.statusText
        );
      } else if (response.status === 400) {
        alert("Missing Required Fields! Please fill in all the fields");
      } else if (response.status === 401) {
        alert(response.statusText + response.status);
      } else if (response.status === 402) {
        const refreshResponse = await refreshToken();
        if (refreshResponse.ok) {
          handleSubmit(e);
        }
      } else {
        console.error("Failed to save template");
      }
    }
  };

  return (
    <>
      <Header isAuthenticated={isAuthenticated} />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h1 className="text-4xl font-bold">Title: {template.title}</h1>
            <p className="text-gray-600">Description: {template.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {template.CodeTemplateTag && template.CodeTemplateTag.length > 0 ? (
              template.CodeTemplateTag.map(
                (tag: { id: number; name: string }) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 rounded-full text-white"
                    style={{
                      backgroundColor: tagColors[tag.id % tagColors.length],
                    }}
                  >
                    {tag.name}
                  </span>
                )
              )
            ) : (
              <p>No tags</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <CodeEditor
            template={template}
            id={template.authorId}
            isAuthor={isAuthor}
            mode="edit"
          />
        </div>
      </div>
    </>
  );
};
export default EditCodeTemplatePage;
