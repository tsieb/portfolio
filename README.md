# Space Portfolio

A feature-rich portfolio application with a space theme built using React, Node.js, Express, and MongoDB. The application includes an interactive home page with orbiting project planets, detailed project pages, and an admin dashboard for content management.

![Space Portfolio](https://via.placeholder.com/1200x600)

## Features

- **Interactive Space-Themed UI**: Animated cosmic interface with planets representing projects
- **Dark/Light Mode**: Toggle between dark (space) and light themes
- **Responsive Design**: Fully responsive across all device sizes
- **Project Showcase**: Detailed project pages with galleries and technology breakdowns
- **Admin Dashboard**: Secure admin area for managing portfolio content
- **Authentication**: JWT-based authentication for admin access
- **RESTful API**: Well-structured backend API for data management

## Technology Stack

### Frontend
- **Framework**: React with functional components and hooks
- **State Management**: React Context API
- **Routing**: React Router
- **Styling**: CSS Modules with SASS/SCSS
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **API Style**: RESTful
- **Authentication**: JWT-based authentication
- **Database**: MongoDB with Mongoose ODM

## Architecture

The application follows a feature-based architecture with clear separation of concerns:

### Frontend Structure
- `/src/assets`: Non-code resources (images, styles, fonts)
- `/src/components`: Reusable UI components
- `/src/context`: Global React contexts
- `/src/data`: Data assets (constants, JSON data)
- `/src/features`: Feature modules (portfolio, project, authentication, contact)
- `/src/hooks`: Custom hooks
- `/src/layouts`: Layout components
- `/src/lib`: External library wrappers
- `/src/pages`: Page components
- `/src/services`: Services for API communication
- `/src/utils`: Utility functions

### Backend Structure
- `/server.js`: Main entry point
- `/middleware`: Express middleware
- `/routes`: API route definitions
- `/services`: Business logic layer
- `/db`: Database connection and models
- `/utils`: Utility functions
- `/config`: Configuration files

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/space-portfolio.git
   cd space-portfolio
   ```

2. Install dependencies
   ```
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables
   ```
   # Create a .env file in the backend directory
   cd backend
   touch .env
   ```

   Add the following variables to the .env file:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/space-portfolio
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. Seed the database with sample data
   ```
   # Start the backend server
   npm run dev
   
   # In a separate terminal, make requests to seed endpoints
   curl -X POST http://localhost:5000/api/auth/seed
   curl -X POST http://localhost:5000/api/projects/seed
   ```

5. Start the development servers
   ```
   # Start the backend server (from the backend directory)
   npm run dev
   
   # Start the frontend server (from the frontend directory)
   cd ../frontend
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

7. Access the admin dashboard at `http://localhost:3000/admin`
   - Use the following credentials:
     - Email: admin@example.com
     - Password: adminpassword

## Deployment

### Local Docker Deployment

1. Build and run with Docker Compose
   ```
   docker-compose up --build
   ```

### AWS Deployment (Basic)

1. Set up an EC2 instance with Node.js
2. Set up a MongoDB Atlas cluster
3. Configure environment variables on the server
4. Clone the repository on the EC2 instance
5. Install dependencies and build the application
6. Use PM2 or similar to keep the Node.js server running

For more advanced deployment options, refer to the [AWS Deployment Guide](/docs/aws-deployment.md).

## Project Structure in Detail

### Frontend Features

- **Portfolio Feature**: Interactive space canvas with orbiting planets
- **Project Feature**: Detailed project pages with information and galleries
- **Authentication Feature**: Admin login and dashboard access
- **Contact Feature**: Contact form with validation

### Backend Features

- **Authentication**: User login, JWT generation and validation
- **Projects API**: CRUD operations for portfolio projects
- **Skills API**: Manage displayable skills and technologies
- **Contact API**: Handle contact form submissions
- **Admin API**: Administrative functions

## Future Improvements

- Server-side rendering for improved SEO
- WebSockets for real-time admin notifications
- Project analytics dashboard
- Blog section with markdown support
- Multi-language support
- Advanced caching strategies
- CI/CD pipeline with GitHub Actions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/) - Frontend library
- [Node.js](https://nodejs.org/) - Backend runtime
- [Express](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Vite](https://vitejs.dev/) - Frontend build tool