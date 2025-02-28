//src/pages/FileManager/FileManager.jsx
import React, { useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
  "application/octet-stream",
];

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [sortBy, setSortBy] = useState("name");

  // Handle file upload with type and size restrictions
  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const validFiles = uploadedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Max size is 5MB.`);
        return false;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        alert(`File ${file.name} is not allowed. Please upload a supported file type.`);
        return false;
      }
      return true;
    });

    // Add valid files to state
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  // Handle file deletion
  const handleDelete = (fileName) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  // Handle file preview
  const handlePreview = (file) => {
    const fileUrl = URL.createObjectURL(file);
    setSelectedFile({
      name: file.name,
      type: file.type,
      size: (file.size / 1024).toFixed(2), // size in KB
      url: fileUrl,
    });
  };

  // Handle file sorting
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Search files
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort files based on user selection
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "size") {
      return a.size - b.size;
    }
    return a.type.localeCompare(b.type);
  });

  return (
    <div className="container p-6">
      {/* File Upload Button */}
      <div className="mb-4">
        <label className="file-upload-button bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
          Choose File
          <input
            type="file"
            multiple // Always allow multiple file selection
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Files..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

      {/* File Sorting */}
      <select onChange={handleSortChange} value={sortBy} className="mb-4">
        <option value="name">Sort by Name</option>
        <option value="size">Sort by Size</option>
        <option value="type">Sort by Type</option>
      </select>

      {/* File List Table */}
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">File Name</th>
            <th className="border px-4 py-2">File Size (KB)</th>
            <th className="border px-4 py-2">File Type</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedFiles.map((file, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{file.name}</td>
              <td className="border px-4 py-2">{(file.size / 1024).toFixed(2)}</td>
              <td className="border px-4 py-2">{file.type}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handlePreview(file)}
                  className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
                >
                  Preview
                </button>
                <button
                  onClick={() => handleDelete(file.name)}
                  className="bg-red-500 text-white px-4 py-2 mr-2 rounded"
                >
                  Delete
                </button>
                <a
                  href={URL.createObjectURL(file)}
                  download={file.name}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* File Preview */}
      {selectedFile && (
        <div className="mt-4">
          <h3 className="font-bold">Preview: {selectedFile.name}</h3>
          <p>Type: {selectedFile.type}</p>
          <p>Size: {selectedFile.size} KB</p>
          {selectedFile.type.startsWith("image/") ? (
            <img src={selectedFile.url} alt="Preview" className="w-64" />
          ) : selectedFile.type === "application/pdf" ? (
            <iframe src={selectedFile.url} width="100%" height="400px" title={`Preview of ${selectedFile.name}`}/>
          ) : (
            <p>Preview not available for this file type.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileManager;
