# 🛠️ Team Sync - Your Ultimate Collaboration Companion

A sleek, fully responsive web application designed to streamline teamwork and project management. Team Sync ensures seamless communication, task tracking, and real-time updates — all in one place.

## 💡 Project Overview

Team Sync is built to revolutionize team collaboration. With a user-friendly interface, intuitive navigation, and seamless cross-device compatibility, this platform allows you to keep your projects on track, manage tasks effortlessly, and ensure smooth communication within teams. Whether you're working from an office or remotely, Team Sync has your back!

## Features

- User Authentication: Secure user registration and login system.
- Project Management: Create, update, and delete projects.
- Task Management: Create, update, and delete tasks within each project.
- User Management: Invite team members to collaborate on projects.
- Real-time Updates: Utilizes WebSockets for real-time project and task updates.
- Dashboard: A user-friendly dashboard to manage your projects and tasks.
- Task Prioritization: Assign priorities to tasks to manage work efficiently.
- Responsive Design: The application is designed to work seamlessly on various devices.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher)
- Git

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/MentorTeamSync/teamsync_Infosys_Internship_Oct2024.git
cd teamsync_Infosys_Internship_Oct2024
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Start development server
npm run start
```

## Environment Variables Setup

### Backend (.env file)
Create a `.env` file in the `backend` directory with the following structure:

```env
DB_CONNECTION_STRING=
JWT_SECRET=
MAILER_PASS=
```

## Development

### Backend Development Server
```bash
cd backend
npm run dev
```

### Frontend Development Server
```bash
cd client
npm start
```

## Production Deployment

1. Build the frontend:
```bash
cd client
npm run build
```

2. Start production server:
```bash
cd backend
npm run start:prod
```

## Contributing

We welcome contributions to enhance the functionality and usability of this project. If you want to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and test thoroughly.
4. Commit your changes with clear and concise messages.
5. Push your changes to your forked repository.
6. Create a pull request to the main repository.

Please ensure that your code follows the coding standards and includes relevant documentation.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Ensure MongoDB is running locally
   - Check MongoDB connection string in .env file
   - Verify network connectivity

2. **Node Module Issues**
   - Try deleting node_modules and package-lock.json
   - Run `npm install` again

3. **Port Conflicts**
   - Check if ports 3001 and 3000 are available

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Happy Project Management with Team Sync! 🚀🔧📊
