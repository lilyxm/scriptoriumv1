import React, { useState } from "react";
import header from "@/components/header";
import CodeEditor from "@/components/CodeEditor/codeEditor";
import { useEffect } from "react";
import Header from "@/components/header";
const NewCodeTemplatePage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const template = {
    id: 0,
    title: "New Code Template",
    description: "New Code Template Description",
    language: "javascript",
    code: "",
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 0,
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = parseInt(localStorage.getItem("userID") || "-1");
    if (userId === -1) {
      var isAuthor = false;
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/code/templates/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ title, description, language, code, tags }),
    });

    if (response.ok) {
      alert("Template has been saved successfully.");
      const data = await response.json();
      window.location.href = `/codeTemplates/${data.template.id}`;
      console.log("Template saved successfully");
    } else {
      if (response.status === 401 || response.status === 403) {
        const confirmSignIn = window.confirm(
          "You need to sign in to save the code template. Do you want to sign in now?"
        );
        if (confirmSignIn) {
          window.location.href = "/signin";
        } else {
          alert(
            "You can continue without signing in, but you won't be able to save the template."
          );
        }
      } else if (response.status === 400) {
        alert("Missing Required Fields! Please fill in all the fields");
      } else if (response.status === 402) {
        const refreshResponse = await fetch("/api/users/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
          body: JSON.stringify({
            refreshToken: localStorage.getItem("refreshToken"),
          }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem("authToken", refreshData.accessToken);
          alert("Session refreshed. Please try saving the template again.");
        } else {
          alert("Failed to refresh session. Please sign in again.");
          window.location.href = "/signin";
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
            <p className="text-gray-600 justify-end">
              This is the default title and description. please click save to
              change the title, description and add tags
            </p>
          </div>
          <div className="container col-span-2">
            <CodeEditor
              template={template}
              id={3}
              isAuthor={isAuthenticated}
              mode="new"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCodeTemplatePage;
