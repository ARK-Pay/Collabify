import React, { useState } from 'react';
import axios from 'axios';

const AddTaskModal = ({ isOpen, onClose, projectId, onTaskAdded }) => {
    const [taskDetails, setTaskDetails] = useState({
        title: '',
        description: '',
        priority: '0',
        deadline: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskDetails({ ...taskDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (!projectId) {
            console.error("Error: projectId is undefined.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No auth token found! User might be unauthorized.");
                return;
            }

            const response = await axios.post(
                `http://localhost:3001/task/project/${projectId}/create-task`, 
                taskDetails, 
                {
                    headers: { 
                        "Authorization": `Bearer ${token}`,  // ✅ Ensure Bearer token format
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Task created:", response.data);
            onTaskAdded(); // Refresh task list
            onClose(); // Close modal
        } catch (error) {
            console.error('Error creating task:', error.response ? error.response.data : error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <input 
                    name="title" 
                    value={taskDetails.title} 
                    onChange={handleChange} 
                    placeholder="Task Title" 
                    required 
                />
                <textarea 
                    name="description" 
                    value={taskDetails.description} 
                    onChange={handleChange} 
                    placeholder="Task Description" 
                    required 
                />
                <select name="priority" value={taskDetails.priority} onChange={handleChange}>
                    <option value="0">Low</option>
                    <option value="1">Medium</option>
                    <option value="2">High</option>
                </select>
                <input 
                    type="date" 
                    name="deadline" 
                    value={taskDetails.deadline} 
                    onChange={handleChange} 
                    required 
                />
                <button type="submit">Create Task</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default AddTaskModal;
