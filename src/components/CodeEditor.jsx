"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react"),
  { ssr: false }
);

const LANGUAGES = [
  { id: "python", name: "Python", version: "3.10.0", extension: "py" },
  { id: "javascript", name: "JavaScript", version: "18.15.0", extension: "js" },
  { id: "java", name: "Java", version: "15.0.2", extension: "java" },
  { id: "cpp", name: "C++", version: "10.2.0", extension: "cpp" },
  { id: "c", name: "C", version: "10.2.0", extension: "c" },
];

export default function CodeEditor({ code, setCode, language, setLanguage }) {
  const currentLang = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];

  return (
    <div className="h-full flex flex-col">
      {/* Language Selector Bar */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center gap-3">
        <label className="text-gray-400 text-sm font-medium">Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium cursor-pointer hover:bg-gray-650 transition-colors"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
        <span className="text-gray-500 text-xs ml-2">
          v{currentLang.version}
        </span>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
            fontFamily: "'Fira Code', 'Cascadia Code', 'Monaco', 'Courier New', monospace",
            fontLigatures: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            renderLineHighlight: "all",
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />
      </div>
    </div>
  );
}

export { LANGUAGES };