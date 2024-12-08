import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useState } from "react";
//https://www.youtube.com/watch?v=WiacAGLd9so: Build a Code Text Ediotor in react in 10 minutes
interface CodeBoxProps {
  language: string;
  code: string;
  setCode: (code: string) => void;
}

const CodeBox: React.FC<CodeBoxProps> = ({ language, code, setCode }) => {
  console.log("CodeBoxProps", language);
  const theme = "dark";
  return (
    <div className="pb-32">
      <Editor
        height="60vh"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme={theme === "dark" ? "vs-dark" : "vs-light"}
      />
    </div>
  );
};

export default CodeBox;
