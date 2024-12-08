import React, { useState } from "react";
import { useEffect } from "react";
import Header from "@/components/header";
import { useRouter } from "next/router";
import CodeEditor from "@/components/CodeEditor/codeEditor";
import { tagColors } from "@/utils/color";
const EditCodeTemplatePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [template, setTemplate] = useState<any>({});
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

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

  return (
    <>
      <Header isAuthenticated={isAuthenticated} />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h1 className="text-4xl font-bold">Title: {template.title}</h1>
            <p className="text-gray-600">Description: {template.description}</p>
            <p className="text-gray-600">
              This is the default title and description. please click save to
              change the title, description and add tags
            </p>
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
            mode="fork"
          />
        </div>
      </div>
    </>
  );
};
export default EditCodeTemplatePage;
