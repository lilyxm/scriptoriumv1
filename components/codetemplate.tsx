import React from "react";
import { CodeTemplate } from "@/utils/types";
import { tagColors } from "@/utils/color";
import { useEffect } from "react";
import { useRouter } from "next/router";
import router from "next/router";

interface CodeTemplateListProps {
  codeTemplates: CodeTemplate[];
  isManage: boolean;
}

const CodeTemplateList: React.FC<CodeTemplateListProps> = ({
  codeTemplates,
  isManage,
}) => {
  async function handleDeleteCodeTemplate(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    templateID: number
  ): Promise<void> {
    event.preventDefault();
    const confirmDelete = confirm(
      "Are you sure you want to delete this template?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/code/templates/${templateID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        alert("Template deleted successfully");
        router.reload();
      } else {
        console.error("Failed to delete template");
        alert("Failed to delete template");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Error deleting template");
    }
  }

  return (
    <ul className="mt-4 space-y-4">
      {codeTemplates.length > 0 ? (
        codeTemplates.map((template) => (
          <li
            key={template.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
          >
            <div
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 cursor-pointer"
              onClick={() =>
                (window.location.href = `/codeTemplates/${template.id}`)
              }
            >
              <div className="flex flex-col items-center space-y-2">
                {template.author && (
                  <>
                    <img
                      src={template.author.avatar || "/user-avatar.png"}
                      alt={template.author.username}
                      className="w-12 h-12 rounded-full"
                    />
                    <p className="text-gray-600 dark:text-gray-400">
                      {template.author.username}
                    </p>
                  </>
                )}
              </div>
              <div className="col-span-2">
                <a
                  href={`/codeTemplates/${template.id}`}
                  className="text-lg font-semibold text-blue-600 dark:text-blue-400"
                >
                  {template.title}
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {template.description}
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {template.language}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <p className="text-gray-600 dark:text-gray-400">
                  ID: {template.id}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {template.CodeTemplateTag.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-white"
                      style={{
                        backgroundColor: tagColors[tag.id % tagColors.length],
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {isManage && (
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/codeTemplates/${template.id}/edit`;
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition duration-200"
                  onClick={(e) => handleDeleteCodeTemplate(e, template.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No code templates available.
        </p>
      )}
    </ul>
  );
};

export default CodeTemplateList;