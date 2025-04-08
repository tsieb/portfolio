# Space Portfolio Backend

This is the backend API server for the Space Portfolio project. It's built with Node.js, Express, and MongoDB, providing RESTful API endpoints for the frontend application.

## Project Structure

The project follows a layered architecture:

```
/src
  /server.js           # Main entry point
  /middleware          # Express middleware
    /auth.js           # Authentication middleware
    /error.js          # Error handling middleware
    /validators.js     # Request validation middleware
  /routes              # API route definitions
    /api               # API routes
      /auth.js         # Authentication routes
      /projects.js     # Portfolio projects routes
      /skills.js       # Skills routes
      /contact.js      # Contact form routes
  /services            # Business logic layer
    /auth.js           # Authentication service
    /project.js        # Project service
    /skill.js          # Skill service
    /contact.js        # Contact service
  /db                  # Database connection and models
    /connection.js     # Database connection setup
    /models            # Mongoose models
      /user.js         # User model
      /project.js      # Project model
      /skill.js        # Skill model
      /message.js      # Contact message model
  /utils               # Utility functions
    /logger.js         # Logging utilities
    /formatters.js     # Data formatters
  /config              # Configuration files
    /env.js            # Environment configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies
   ```
   npm install
   ```

2. Set up environment variables
   - Create a `.env` file in the root directory
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/space-portfolio
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Seed the database (in development mode)
   ```
   # Create admin user
   curl -X POST http://localhost:5000/api/auth/seed
   
   # Create sample projects
   curl -X POST http://localhost:5000/api/projects/seed
   ```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

#### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create a new project (admin)
- `PUT /api/projects/:id` - Update a project (admin)
- `DELETE /api/projects/:id` - Delete a project (admin)
- `GET /api/projects/slug/:slug` - Get project by slug

#### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/categories` - Get skill categories
- `GET /api/skills/:id` - Get skill by ID
- `POST /api/skills` - Create a new skill (admin)
- `PUT /api/skills/:id` - Update a skill (admin)
- `DELETE /api/skills/:id` - Delete a skill (admin)

#### Contact
- `POST /api/contact` - Send a contact message
- `GET /api/contact/messages` - Get all messages (admin)
- `GET /api/contact/messages/:id` - Get message by ID (admin)
- `PUT /api/contact/messages/:id` - Update message status (admin)
- `DELETE /api/contact/messages/:id` - Delete a message (admin)

## Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests

## Dependencies

- Express for API server
- Mongoose for MongoDB object modeling
- bcryptjs for password hashing
- jsonwebtoken for JWT authentication
- express-validator for request validation
- winston for logging
- dotenv for environment variables
- cors for Cross-Origin Resource Sharing

## Error Handling

The API uses a centralized error handling middleware that formats errors consistently:

```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "User-friendly error message",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Protected routes require a valid token in the Authorization header:

```
Authorization: Bearer <token>
```

## Development and Testing

For development purposes, there are seed endpoints available to create test data:
- `/api/auth/seed` - Creates an admin user
- `/api/projects/seed` - Creates sample projects

These endpoints are only available in development mode.