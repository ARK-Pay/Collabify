const {Notification, Project, User} = require("../db/index"); 
require("dotenv").config();

const getUnreadMessagesByProject = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Validate user_id
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
        }

        const user=User.findOne({id:user_id})
        if(!user) return res.status(401).json({success:false,message:'User not found'});

        // Fetch all notifications for the user
        const unreadMessages = await Notification.find(
            { user_id },
            { project_id: 1, unread_messages: 1, _id: 0 } // Select only necessary fields
        ).lean(); // Ensure it returns plain JS objects
        
        // Get project names for all project IDs in unreadMessages
        const projectNames = await Project.find(
            { id: { $in: unreadMessages.map(message => message.project_id) } },
            { _id: 0, name: 1, id: 1 }
        ).lean();
        
        // Create a map for faster lookups
        const projectMap = projectNames.reduce((acc, project) => {
            acc[project.id] = project.name;
            return acc;
        }, {});
        
        // Add the project_name field to each unread message
        const updatedUnreadMessages = unreadMessages.map(message => ({
            ...message, // Spread the existing fields
            project_name: projectMap[message.project_id] || "Unknown Project" // Add project name or fallback
        }));
        res.status(200).json(updatedUnreadMessages);

    } catch (error) {
        console.error('Error fetching unread messages by project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch unread messages',
        });
    }
};
const getTotalUnreadMessages = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Validate user_id
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
        }

        // Sum the unread_messages directly from the database
        const notifications = await Notification.find({ user_id });

        // Calculate total unread count
        const totalUnreadCount = notifications.reduce(
            (total, notification) => total + notification.unread_messages,
            0
        );

        res.status(200).json({
            success: true,
            total_unread: totalUnreadCount,
        });
    } catch (error) {
        console.error('Error fetching total unread messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch total unread messages',
        });
    }
};

// Mark all unread messages as read for a user and a project
const markMessagesAsRead = async (req, res) => {
    const { project_id } = req.body; // Extract the project ID from the request body
    const user_id = req.userId; // Extract the user ID from authenticated middleware
    console.log(user_id)
  
    try {
      const result = await Notification.findOneAndDelete(
        { project_id, user_id }
      );
  
      if (!result) {
        return res.status(404).json({ message: 'No unread messages found for this project.' });
      }
  
      res.status(200).json({ message: 'Unread messages marked as read.', notification: result });
    } catch (error) {
      console.error('Error updating unread messages:', error);
      res.status(500).json({ message: 'Failed to mark messages as read.', error });
    }
};

//export
module.exports = {getUnreadMessagesByProject, getTotalUnreadMessages,markMessagesAsRead}