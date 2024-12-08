import React, { useState } from "react";
import SaveCodeTemplate from "@/components/CodeEditor/saveCodeTemplate";
import { refreshToken } from "@/utils/refresh";
import { CodeTemplate } from "@/utils/types";
import router from "next/router";
interface saveProps {
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  template: CodeTemplate;
  mode: string;
}

const save: React.FC<saveProps> = ({ template, mode }) => {
  const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false);
  const handleSaveClick = () => {
    setIsSaveTemplateOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent, template: CodeTemplate) => {
    console.log("here");

    e.preventDefault();
    setIsSaveTemplateOpen(false);
    const response = await fetch(`/api/code/templates/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({
        title: template.title,
        description: template.description,
        language: template.language,
        code: template.code,
        tags: template.CodeTemplateTag,
      }),
    });
    console.log("response", response);
    if (response.ok) {
      alert("Template has been saved successfully.");
      const data = await response.json();
      console.log("Data: here", data);
      window.location.href = `/codeTemplates/${data.template.id}`;
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
          handleSubmit(e, template);
        }
      } else {
        console.error("Failed to save template");
      }
    }
  };
  return (
    <div>
      <button
        onClick={handleSaveClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
      >
        Save
      </button>
      {isSaveTemplateOpen && (
        <SaveCodeTemplate
          title={template.title}
          description={template.description}
          code={template.code}
          language={template.language}
          onSave={handleSubmit}
          tags={[]}
          onCancel={() => setIsSaveTemplateOpen(false)}
          template={template}
        />
      )}
    </div>
  );
};

export default save;
