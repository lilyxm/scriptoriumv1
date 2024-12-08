import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import okaidia from "react-syntax-highlighter/dist/cjs/styles/prism/okaidia";

interface CodeBoxProps {
  language: string;
  code: string;
  setCode: (code: string) => void;
}

const CodeBox: React.FC<CodeBoxProps> = ({ language, code, setCode }) => {
  console.log("CodeBoxProps", language);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
  };

  return (
    <div className="relative h-full overflow-auto">
      <textarea
        value={code}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const newValue =
              code.substring(0, start) + "\t" + code.substring(end);
            setCode(newValue);
            e.currentTarget.selectionStart = e.currentTarget.selectionEnd =
              start + 1;
          }
        }}
        className="w-[calc(100%-16px)] h-[calc(100%-16px)] font-mono text-transparent bg-transparent caret-white border-none resize-none absolute top-0 left-0 z-10"
        style={{ overflow: "hidden" }}
      />
      <SyntaxHighlighter
        language={language}
        style={okaidia}
        customStyle={{
          width: "calc(100% - 16px)",
          height: "calc(100% - 16px)",
          fontFamily: "monospace",
          fontSize: "1em",
          margin: 0,
          padding: 0,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBox;
