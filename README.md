# Portfolio Project

A full-stack portfolio web application built with the MERN stack (MongoDB, Express, React, Node.js).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Docker Setup](#docker-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Responsive Design**: Works on all devices and screen sizes
- **Dynamic Portfolio**: Display projects, skills, and experience
- **Project Management**: Admin dashboard to add, edit, and delete projects
- **Contact Form**: Allow visitors to send messages
- **Authentication**: Secure admin access with JWT
- **Theme Switcher**: Light and dark mode support
- **Markdown Support**: Rich text formatting for project descriptions

## Tech Stack

### Frontend
- **Framework**: React with functional components and hooks
- **State Management**: React Context API
- **Routing**: React Router
- **Styling**: SCSS Modules
- **Build Tool**: Vite
- **Type Safety**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **Validation**: Joi
- **Type Safety**: TypeScript

### Infrastructure
- **Containerization**: Docker
- **Deployment**: AWS/Vercel/Netlify (choose your platform)

## Project Structure

The project follows a feature-based organization:

```
/
├── backend/               # Backend API
│   ├── src/
│   │   ├── db/            # Database models and connection
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── server.ts      # Main entry point
│   └── ...
├── frontend/              # Frontend React application
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── layouts/       # Page layouts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── ...
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Set up backend environment variables:
   ```bash
   cp .env.example .env
   # Edit the .env file with your configuration
   ```

4. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

5. Set up frontend environment variables:
   ```bash
   cp .env.example .env
   # Edit the .env file with your configuration
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Seed the database with initial data:
   ```bash
   cd backend
   npm run seed
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Admin login:
     - Email: admin@example.com
     - Password: admin123 (or as configured in .env)

## Docker Setup

You can also run the application using Docker:

1. Start the entire stack:
   ```bash
   docker-compose up
   ```

2. For production build:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Deployment

### Backend

1. Build the backend for production:
   ```bash
   cd backend
   npm run build
   ```

2. Deploy the `dist` directory to your preferred hosting platform

### Frontend

1. Build the frontend for production:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist` directory to a static hosting service like Netlify, Vercel, or AWS S3

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.