const { z } = require('zod');
require("dotenv").config();
const { Project,Task,User,ProjectUser } = require("../db/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Define the schema for fields that are expected in the request body
const FileSchema = z.object({
    fileName: z.string(),
    fileType: z.string(),
    fileSize: z.number(),
    data: z.string() // Base64 encoded file data
  });
  
  const CommentZodSchema = z.object({
    project_id: z.string().min(1, "Project ID is required."),
    task_id: z.string().optional(),
    creator_id: z.string().min(1, "Creator ID is required."),
    content: z.string().optional(),
    file: FileSchema.optional()
  }).refine(
    (data) => {
      // Check if either content or file is provided
      return !!(data.content || data.file);
    },
    {
      message: "Either content or a file must be provided.",
      path: ["content", "file"]
    }
  );

  const getMessagesSchema=z.object({
    project_id: z.string().min(1, "Project ID is required."),
    task_id: z.string().optional()
  })
  

async function tokenValidate(req,res,next){
    //check if token is in headers
    const token = req.headers['authorization'];
    if(!token) return res.status(401).send({message: 'No token found'});
    //check if token is valid
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //extract email from token
        const email = decoded.email;
        //check if user exists
        const user = await User.findOne({email});
        if(!user) return res.status(401).send({message: 'User not found'})
          req.user=user;
        next();
    }catch(err){
        return res.status(401).send({message: 'Invalid token'});
    }
}

async function userAuthorize(req,res,next){
  try {
    //get project_id from req body
    const projectId = req.body.project_id;
    //check if project exists
    const project = await Project.findOne({id: projectId});
    if(!project) return res.status(404).send({message: 'Project not found'});
    //check if user is a part of this project
    const projectUser = await ProjectUser.findOne({
        user_id:req.user.id,
        project_id:projectId
    });
    if(!projectUser) return res.status(401).send({message: 'User is not part of this project'});
    next();
  } catch (error) {
    console.log("dakha")
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}

// Middleware function to validate the request body using Zod schema
async function messageSchemaCheck(req,res,next){
    try {
        const result = CommentZodSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).send({ message: error.issues[0].message });
    }
}

// Middleware function to validate the request body using the getMessagesSchema
async function getMessagesSchemaCheck(req,res,next){
  try {
    const result = getMessagesSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).send({ message: error.issues[0].message });
  }
}


//export
module.exports = {tokenValidate,
    messageSchemaCheck,
    userAuthorize,
    getMessagesSchemaCheck
};