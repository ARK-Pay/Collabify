const express = require("express");
require("dotenv").config();
const authenticate = require("../middlewares/authenticate"); // Ensure authentication
const {
    validateTaskCreation,
    createTask,
    viewTasksByProject,
    validateAddAssignee,
    addAssignee,
    validateEditDetails,
    editTaskDetails,
    deleteTask,
    getTasksCreatedByUser,
    getTasksAssignedToUser,
    getAssignedUsers
} = require('../middlewares/TaskMiddlewares');

const router = express.Router();

// ✅ Create Task (with authentication)
router.post('/project/:project_id/create-task', authenticate, validateTaskCreation, async (req, res) => {
    console.log("Received create-task request with data:", req.body); // Debugging
    const { project_id } = req.params;
    
    if (!project_id) {
        return res.status(400).json({ error: 'Project ID is required' });
    }

    try {
        const newTask = {
            projectId: project_id,
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            deadline: req.body.deadline,
            status: 'pending'
        };

        console.log("Task created:", newTask);
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// ✅ View tasks by project
router.get('/project/:project_id/view-tasks', authenticate, viewTasksByProject);

// ✅ Assign a task
router.post('/:task_id/add-assignee', authenticate, validateAddAssignee, addAssignee);

// ✅ Edit task details
router.put('/:task_id/edit-details', authenticate, validateEditDetails, editTaskDetails);

// ✅ Delete a task
router.delete('/project/:project_id/delete-task', authenticate, deleteTask);

// ✅ Get tasks created by user
router.get('/user/:userEmail/created-tasks', authenticate, getTasksCreatedByUser);

// ✅ Get tasks assigned to a user
router.get('/user/:user_id/assigned-tasks', authenticate, getTasksAssignedToUser);

// ✅ Get all users assigned to a task
router.get('/:task_id/assigned-users', authenticate, getAssignedUsers);

module.exports = router;
