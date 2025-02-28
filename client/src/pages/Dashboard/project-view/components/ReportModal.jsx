import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import jsPDF from "jspdf";
import { DownloadIcon } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const ReportModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    pastDueTasks: 0,
  });

  const chartData = {
    labels: ["Completed Tasks", "Pending Tasks", "Past Due Tasks"],
    datasets: [
      {
        label: "Tasks",
        data: [taskStats.completedTasks, taskStats.pendingTasks, taskStats.pastDueTasks],
        backgroundColor: ["#2563eb", "#1d4ed8", "#1e3a8a"],
        hoverBackgroundColor: ["#3b82f6", "#2563eb", "#1d4ed8"],
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const projectUsers = localStorage.getItem("project_users");
  const projectFiles = localStorage.getItem("project_files");
  const projectName = localStorage.getItem("project_name");
  const projectPriority = localStorage.getItem("project_priority");
  const projectStatus = localStorage.getItem("project_status");
  const projectId = localStorage.getItem("project_id");
  const projectCreator = localStorage.getItem("project_creator");
  const projectDeadline = localStorage.getItem("project_deadline");
  const projectDescription = localStorage.getItem("project_description");
  const projectTags = localStorage.getItem("project_tags");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/project/report/${projectId}`, {
          headers: {
            authorization: token,
          },
        });

        setTaskStats(response.data);
      } catch (error) {
        console.error("Error fetching task stats:", error);
        if (error.response) {
          switch (error.response.status) {
            case 400:
              alert("Authentication error. Please log in again.");
              break;
            case 401:
              alert("Project not found.");
              break;
            case 500:
              alert("Internal server error. Please try again later.");
              break;
            default:
              alert("An error occurred while fetching project report.");
          }
        }
      }
    };

    if (isOpen && projectId && token) {
      fetchTaskStats();
    }
  }, [isOpen, projectId, token]);

  const generatePDF = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text("Project Report", 20, 20);
  
    doc.setFontSize(12);
    doc.text(`Name: ${projectName}`, 20, 30);
    doc.text(`Priority: ${projectPriority}`, 20, 40);
    doc.text(`Status: ${projectStatus}`, 20, 50);
    doc.text(`Creator: ${projectCreator}`, 20, 60);
    doc.text(`Deadline: ${projectDeadline}`, 20, 70);
    doc.text(`Description: ${projectDescription}`, 20, 80);
    doc.text(`Tags: ${projectTags}`, 20, 90);
    doc.text(`Total Tasks: ${taskStats.totalTasks}`, 20, 100);
    doc.text(`Completed Tasks: ${taskStats.completedTasks}`, 20, 110);
    doc.text(`Pending Tasks: ${taskStats.pendingTasks}`, 20, 120);
    doc.text(`Past Due Tasks: ${taskStats.pastDueTasks}`, 20, 130);
    doc.text(`Total Members: ${projectUsers}`, 20, 140);
    doc.text(`Total Files: ${projectFiles}`, 20, 150);
  
    const chartCanvas = document.createElement("canvas");
    const chartContext = chartCanvas.getContext("2d");
    const chartJSInstance = new ChartJS(chartContext, {
      type: "pie",
      data: chartData,
      options: {
        responsive: false,
      },
    });
  
    chartCanvas.width = 150;
    chartCanvas.height = 150;
    chartJSInstance.draw();
  
    const chartImageData = chartCanvas.toDataURL("image/png");
    const chartWidth = 80;
    const chartHeight = 80;
    const chartX = 130;
    const chartY = 20;
  
    doc.addImage(chartImageData, "PNG", chartX, chartY, chartWidth, chartHeight);
  
    doc.save("project_report.pdf");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-950 hover:bg-blue-900 text-white font-medium py-2 px-4 rounded-lg shadow-lg flex items-center"
      >
        <DownloadIcon className="mr-2 cursor-pointer" />
        Report
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="bg-gray-100 rounded-lg w-[600px] max-h-[85vh] overflow-y-auto shadow-lg z-50 relative">
            <div className="sticky top-0 bg-blue-950 z-10 border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Project Report</h2>
              <button
                onClick={generatePDF}
                className="bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg shadow-lg flex items-center"
              >
                <DownloadIcon className="mr-2 cursor-pointer" />
                Download PDF
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-300 rounded-full p-2 transition-all"
              >
                ✕
              </button>
            </div>
            {/* Modal Body: Flex Layout */}
            <div className="flex flex-col md:flex-row gap-6 p-6">
              {/* Left Side: Chart or Message */}
              <div className="w-full md:w-1/2 flex items-center justify-center bg-blue-50 p-4 rounded-md shadow-md">
                {taskStats.totalTasks === 0 ? (
                  <div className="bg-blue-100 border border-blue-300 text-blue-800 text-center rounded-md p-4 shadow-md">
                    <p className="font-semibold text-lg">No tasks available</p>
                    <p className="text-sm mt-2">
                      This project currently has no tasks assigned. Please add
                      tasks to view progress.
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-[250px] bg-gray-200">
                    <Pie data={chartData} />
                  </div>
                )}
              </div>
              {/* Right Side: Details */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className="bg-gray-200 p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Project Overview
                  </h3>
                  <p className="text-gray-600">Name: {projectName}</p>
                  <p className="text-gray-600">Priority: {projectPriority}</p>
                  <p className="text-gray-600">Status: {projectStatus}</p>
                </div>
                {/* Tasks */}
                <div className="bg-gray-200 p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Tasks</h3>
                  <p className="text-gray-600">
                    Total Tasks: {taskStats.totalTasks}
                  </p>
                  <p className="text-gray-600">
                    Completed Tasks: {taskStats.completedTasks}
                  </p>
                  <p className="text-gray-600">
                    Pending Tasks: {taskStats.pendingTasks}
                  </p>
                  <p className="text-gray-600">
                    Past Due: {taskStats.pastDueTasks}
                  </p>
                </div>
                {/* Team */}
                <div className="bg-gray-200 p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Team</h3>
                  <p className="text-gray-600">Total Members: {projectUsers}</p>
                </div>
                {/* Files */}
                <div className="bg-gray-200 p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Files</h3>
                  <p className="text-gray-600">Total Files: {projectFiles}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default ReportModal;