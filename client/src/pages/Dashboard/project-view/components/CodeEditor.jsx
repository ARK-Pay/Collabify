import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserHTML from "prettier/parser-html";
import parserCSS from "prettier/parser-postcss";
import "./FolderUploadCodeEditor.css";

const buildFileTree = (files) => {
  const tree = {};
  files.forEach((file) => {
    const parts = file.webkitRelativePath.split("/");
    let current = tree;
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = index === parts.length - 1 ? file : {};
      }
      current = current[part];
    });
  });
  return tree;
};

const FolderUploadCodeEditor = () => {
  const [files, setFiles] = useState([]);
  const [fileTree, setFileTree] = useState({});
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContents, setFileContents] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const autoSaveRef = useRef(null);

  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      openFiles.forEach((file) => {
        if (fileContents[file.name]) {
          localStorage.setItem(file.name, fileContents[file.name]);
        }
      });
    }, 5000);
    return () => clearInterval(autoSaveRef.current);
  }, [openFiles, fileContents]);

  const handleFolderUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(uploadedFiles);
    setFileTree(buildFileTree(uploadedFiles));
  };

  const handleFileClick = (file) => {
    if (!openFiles.find((f) => f.name === file.name)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFile(file);
    if (!fileContents[file.name]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const savedContent = localStorage.getItem(file.name) || e.target.result;
        setFileContents((prev) => ({ ...prev, [file.name]: savedContent }));
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadFile = () => {
    if (!activeFile) {
      alert("No file selected to download.");
      return;
    }
    const fileContent = fileContents[activeFile.name];
    if (!fileContent) {
      alert("No content available to download.");
      return;
    }
    
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderTree = (node) => {
    return Object.entries(node).map(([key, value]) => {
      if (typeof value === "object" && !(value instanceof File)) {
        return (
          <li key={key} className="tree-item folder">
            <details>
              <summary>{key}</summary>
              <ul>{renderTree(value)}</ul>
            </details>
          </li>
        );
      } else {
        return (
          <li key={key} className="tree-item file">
            <span onClick={() => handleFileClick(value)}>{key}</span>
          </li>
        );
      }
    });
  };

  return (
    <div className="container">
      <div className="upload-section">
        <input type="file" webkitdirectory="true" multiple onChange={handleFolderUpload} className="upload-input" />
      </div>
      <button className="download-button" onClick={handleDownloadFile}>Download File</button>
      <div className="editor-container">
        <div className="file-tree">
          <h3>File Explorer</h3>
          <input
            type="text"
            placeholder="Search files..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="tree-list">{renderTree(fileTree)}</ul>
        </div>
        <div className="code-editor">
          <div className="tab-bar">
            {openFiles.map((file) => (
              <div
                key={file.name}
                className={`tab ${activeFile && activeFile.name === file.name ? "active" : ""}`}
                onClick={() => setActiveFile(file)}
              >
                {file.name}
              </div>
            ))}
          </div>
          {activeFile && <h3 className="file-title">Editing: {activeFile.name}</h3>}
          <Editor
            height="500px"
            theme="vs-dark"
            defaultLanguage="javascript"
            language={activeFile ? activeFile.name.split(".").pop() : "plaintext"}
            value={fileContents[activeFile?.name] || ""}
            onChange={(value) => setFileContents((prev) => ({ ...prev, [activeFile.name]: value }))}
          />
        </div>
      </div>
    </div>
  );
};

export default FolderUploadCodeEditor;