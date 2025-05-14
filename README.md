# Real-Time Chat Application

This is a full-stack real-time chat application built with modern web technologies. This application enables users to communicate instantly through direct messages and group chats with features like typing indicators, notifications, and real-time message delivery.

## Features

- **Real-time messaging** powered by Socket.io
- **User authentication** with JWT
- **Direct messaging** between users
- **Group chat** functionality with admin controls
- **Profile management** with image uploads
- **Typing indicators** to show when others are typing
- **Notifications** for new messages

## Tech Stack

### Frontend

- **React 19** with TypeScript
- **Zustand** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Socket.io Client** for real-time communication
- **Axios** for API requests
- **React Hot Toast** for notifications

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose for database
- **Socket.io** for real-time functionality
- **JWT** for authentication
- **Cloudinary** for image storage
- **Multer** for file uploads
- **Bcrypt** for password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas)
- Cloudinary account (for image uploads)

### Installation

#### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file and copy environment variables from .env.example
4. Start the development server:
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file and copy environment variables from .env.example

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`