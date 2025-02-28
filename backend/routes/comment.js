// routes/adminRoutes.js  
const express = require("express");
const router = express.Router();
const { Comment } = require("../db/index");
// const multer = require('multer');    
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const {
    tokenValidate,
    messageSchemaCheck,
    userAuthorize,
    getMessagesSchemaCheck
} = require("../middlewares/CommentMiddlewares");
const {tokenValidation} = require("../middlewares/NotificationMiddlewares");
const { getUnreadMessagesByProject, getTotalUnreadMessages, markMessagesAsRead } = require('../controllers/NotificationController');
  

router.post("/send-message", tokenValidate, userAuthorize, messageSchemaCheck, async (req, res) => {
  try {
      const { project_id, creator_id, content } = req.body;
      
      //  Create the base comment object with mandatory fields
      const commentData = {
          project_id,
          creator_id
      };

      //  Add optional task_id if it exists
      if (req.body.task_id) {
          commentData.task_id = req.body.task_id;
      }

      //  Add content if it exists
      if (content) {
          commentData.content = content;
      }

      // Add  file data if it exists in the request
      if (req.body.file) {
          commentData.file_name = req.body.file.fileName;
          commentData.file_type = req.body.file.fileType;
          commentData.file_size = req.body.file.fileSize;
          commentData.file_data = req.body.file.data;  // base64 data
      }

      // Create and save the new comment 
      const newComment = new Comment(commentData);
      await newComment.save();

      return res.status(201).json({ 
          success: true,
          message: 'Message sent successfully.',
          comment_id: newComment.id 
      });

  } catch (error) {
      console.error('Error sending message:', error);
      
      if (error.name === 'ValidationError') {
          return res.status(400).json({ 
              success: false,
              message: 'Invalid data provided',
              error: error.message 
          });
      }

      return res.status(500).json({ 
          success: false,
          message: 'Error sending message.',
          error: error.message 
      });
  }
});

// Download route handler   
router.get("/download/:id",tokenValidate, async (req, res) => {
  try {
      const comment = await Comment.findById(req.params.id);
      
      if (!comment) {
          return res.status(404).json({
              success: false,
              message: "Comment not found"
          });
      }

      if (!comment.file_data) {
          return res.status(404).json({
              success: false,
              message: "No file attached to this comment"
          });
      }

      // Convert base64 to buffer  
      const fileBuffer = Buffer.from(comment.file_data, 'base64');

      // Set headers for file download  
      res.setHeader('Content-Type', comment.file_type);
      res.setHeader('Content-Disposition', `attachment; filename=${comment.file_name}`);
      res.setHeader('Content-Length', comment.file_size);

      // Send the file  
      return res.send(fileBuffer);

  } catch (error) {
      console.error('Error downloading file:', error);
      return res.status(500).json({
          success: false,
          message: "Error downloading file",
          error: error.message
      });
  }
});

router.put("/like-dislike",tokenValidate, async (req,res)=>{
    try {
        //req body will have like which will be 0 or 1 and comment_id use zod to validate  
        const {comment_id,like} = req.body;
        const comment = await Comment.findById(comment_id);
        if(!comment){
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }
        console.log(comment);
        let t=-1;
        if(like===1&&comment.likes.includes(req.user.id)){
            const index = comment.likes.indexOf(req.user.id);
            if(index>-1){
                comment.likes.splice(index,1);
            }
            t=1;
        }else if(like===1){
            //if user has dislike this than first remove that dislike  
            comment.dislike=comment.dislike.filter(id=>id!==req.user.id);
            comment.likes.push(req.user.id);
            t=1
        }
        if(like===0 && comment.dislike.includes(req.user.id) && t===-1){
            const index = comment.dislike.indexOf(req.user.id);
            if(index>-1){
                comment.dislike.splice(index,1);
            }
            t=1;
        }
        else if(t===-1){
            //if user has like this than first remove that like  
            comment.likes=comment.likes.filter(id=>id!==req.user.id);
            comment.dislike.push(req.user.id);
        }
        await comment.save();
        return res.status(200).json({
            success: true,
            message: "Like/Dislike updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error liking disliking messages",
            error: error.message
        });
    }
})

router.post("/messages",tokenValidate,getMessagesSchemaCheck, async (req,res)=>{
    const {project_id,task_id}=req.body;
    try {
        let comments;
        if(task_id){
            comments = await Comment.find({project_id,task_id});
        }else{
            comments = await Comment.find({project_id,task_id:null});
        }
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching messages",
            error: error.message
        });
    }
})

router.post("/get-files",tokenValidate,async(req,res)=>{
    try {
        const {project_id} = req.body;
        const comments = await Comment.find({project_id,file_data:{$exists:true}});
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching files",
            error: error.message
        });
    }
})

// Route to get unread messages by project for a user   
router.get('/unread-by-project/:user_id', getUnreadMessagesByProject);

// Route to get the total unread messages for a user   
router.get('/total-unread/:user_id', getTotalUnreadMessages);

// Route to mark unread messages as read  
router.post('/markAsRead', tokenValidation, markMessagesAsRead);


module.exports = router;    

//listen carefully, in this frontend code of file table to the download icon button add the download functionality use the following two html and backend route code and use them in the finally sent FileTable.jsx code and already the file_data is recieved while getting data to display files so use it to get file related details and get code ref from backend route to convert data to stuff and get ref from html file how to use that binary data to generate file back with proper extension and stuff and then download it on user end.    

