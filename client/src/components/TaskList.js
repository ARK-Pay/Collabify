import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskList = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks for the specified project
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Delete a task and update the task list state
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/projects/${projectId}/tasks`, { data: { task_id: taskId } });
      // Filter out the deleted task
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div>
      <h1>Task List for Project {projectId}</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.name}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
