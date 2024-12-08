import React, { useState } from "react";
import { useRouter } from "next/router";
import SaveExisting from "@/components/CodeEditor/saveExisting";
import SaveNew from "@/components/CodeEditor/saveNew";
import { CodeTemplate } from "@/utils/types";
import CodeBlock from "@/components/CodeEditor/codeBox_2";

interface CodeEditorProps {
  template: CodeTemplate;
  id: number; //authorId
  isAuthor: boolean;
  mode: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  template,
  id, //authorId
  isAuthor,
  mode,
}) => {
  console.log("id,", id);
  console.log("template,", template);
  const router = useRouter();
  const [language, setLanguage] = useState(template.language);
  const [code, setCode] = useState(template.code);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  React.useEffect(() => {
    console.log("template,", template.language);
    setLanguage(template.language);
    setCode(template.code);
  }, [template]);

  async function handleRun(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    setIsExecuting(true);
    setOutput("executing...");
    try {
      const res = await fetch("/api/code/executeDocker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          stdin: stdin,
          language: language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Execution result:", data.output);
        setOutput(data.output);
      } else if (res.status === 300) {
        const data = await res.json();
        console.log("Execution result:", data.error);
        setOutput(data.error);
      } else {
        console.error("Failed to execute code");
        alert("Failed to execute code");
      }
    } catch (error) {
      console.error("Error executing code:", error);
      alert("Error executing code");
    } finally {
      setIsExecuting(false);
    }
  }

  const handleFork = () => {
    if (id <= 0) {
      alert("You need to be logged in to fork a template");
      return;
    }

    router.push(`/codeTemplates/${template.id}/fork`);
    const confirmFork = confirm(
      "You will be going to a forked version of the original code template. Continue?"
    );
    if (confirmFork) {
      router.push(`/codeTemplates/${template.id}/fork`);
    }
  };

  async function handleDeleteCodeTemplate(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();
    const confirmDelete = confirm(
      "Are you sure you want to delete this template?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/code/templates/${template.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        alert("Template deleted successfully");
        router.push(`/user/${id}/manage?manage=code`);
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
    <div>
      <div>
        <label className="block text-lg font-semibold mb-2">Language:</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript" selected={language === "javascript"}>
            JavaScript
          </option>
          <option value="python" selected={language === "python"}>
            Python
          </option>
          <option value="java" selected={language === "java"}>
            Java
          </option>
          <option value="cpp" selected={language === "cpp"}>
            C++
          </option>
          <option value="c" selected={language === "c"}>
            C
          </option>
          <option value="ruby" selected={language === "ruby"}>
            Ruby
          </option>
          <option value="go" selected={language === "go"}>
            Go
          </option>
          <option value="swift" selected={language === "swift"}>
            Swift
          </option>
          <option value="php" selected={language === "php"}>
            PHP
          </option>

          <option value="bash" selected={language === "bash"}>
            Bash
          </option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <div>
            <label className="block text-lg font-semibold mb-2">stdin:</label>
            <textarea
              className="w-full h-[5vh] p-2 border rounded"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
            />
          </div>
          <label className="block text-lg font-semibold mb-2">Code:</label>
          <div className="w-full h-[60vh] border rounded">
            <CodeBlock language={language} code={code} setCode={setCode} />
          </div>
        </div>

        <div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded mb-12"
              onClick={handleRun}
              disabled={isExecuting}
            >
              ▷ Run
            </button>
            {mode === "view" && (
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded mb-12"
                onClick={handleFork}
              >
                Fork
              </button>
            )}
            {isAuthor && mode === "view" && (
              <>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded mb-12"
                  onClick={handleDeleteCodeTemplate}
                >
                  Delete
                </button>
                {mode === "view" && (
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded mb-12"
                    onClick={() =>
                      router.push(`/codeTemplates/${template.id}/edit`)
                    }
                  >
                    Edit
                  </button>
                )}
              </>
            )}

            {mode === "edit" && (
              <div className="ml-auto">
                <SaveExisting
                  template={{
                    id: template.id,
                    title: template.title,
                    description: template.description,
                    code: code,
                    language: language,
                    CodeTemplateTag: template.CodeTemplateTag,
                  }}
                  title={""}
                  description={""}
                  code={""}
                  language={""}
                  tags={[]}
                  mode={mode}
                />
              </div>
            )}
            {(mode === "new" || mode === "fork") && (
              <div className="ml-auto">
                <SaveNew
                  template={{
                    id: template.id,
                    title: template.title,
                    description: template.description,
                    code: code,
                    language: language,
                    CodeTemplateTag: template.CodeTemplateTag,
                  }}
                  title={""}
                  description={""}
                  code={""}
                  language={""}
                  tags={[]}
                  mode={mode}
                />
              </div>
            )}
          </div>
          <label className="block text-lg font-semibold mb-2">Output:</label>
          <textarea
            className="w-full h-[60vh] p-2 border rounded"
            value={output}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
