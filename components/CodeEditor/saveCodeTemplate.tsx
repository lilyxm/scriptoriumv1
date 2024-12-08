import React, { useState } from "react";
import ReactDOM from "react-dom";
import router from "next/router";
import { CodeTemplate } from "@/utils/types";

interface SaveCodeTemplateProps {
  title: string;
  description: string;
  tags: string[];
  language: string;
  code: string;
  template: CodeTemplate;
  onSave: (
    e: React.MouseEvent<HTMLButtonElement>,
    template: CodeTemplate
  ) => void;
  onCancel: () => void;
}

const SaveCodeTemplate: React.FC<SaveCodeTemplateProps> = ({
  title,
  description,
  tags,
  language,
  code,
  onSave,
  onCancel,
  template,
}) => {
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editTags, setEditTags] = useState(tags.join(", "));
  const [editLanguage, setEditLanguage] = useState(language);
  const [editCode, setEditCode] = useState(code);

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSave(e, {
      id: template.id,
      title: editTitle,
      description: editDescription,
      language: editLanguage,
      CodeTemplateTag: editTags.split(","),
      code: editCode,
    });
  };

  return (
    <div>
      {ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title:
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description:
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tags (comma separated):
                </label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Language:
                </label>
                <select className="w-full p-2 border rounded" value={language}>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="cpp">C++</option>
                  <option value="ruby">Ruby</option>
                  <option value="go">Go</option>
                  <option value="php">PHP</option>
                  <option value="typescript">TypeScript</option>
                  <option value="swift">Swift</option>
                  <option value="kotlin">Kotlin</option>
                  <option value="rust">Rust</option>
                  <option value="scala">Scala</option>
                  <option value="perl">Perl</option>
                  <option value="haskell">Haskell</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Code:
                </label>
                <textarea
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const popupStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  width: "400px",
  maxHeight: "80vh",
  overflowY: "auto",
};

export default SaveCodeTemplate;
