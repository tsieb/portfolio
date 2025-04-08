# Space Portfolio Frontend

This is the frontend application for the Space Portfolio project. It's built with React, using Vite as the build tool, and features a space-themed UI with interactive elements.

## Project Structure

The project follows a feature-based architecture:

```
/src
  /assets              # Non-code resources (images, styles, fonts)
  /components          
    /ui                # Reusable UI components
    /form              # Form components
  /context             # Global React contexts (auth, theme, projects)
  /data                # Data assets (constants, JSON data)
  /features
    /authentication    # Authentication feature (admin login, dashboard)
    /portfolio         # Portfolio feature (space canvas, planets)
    /project           # Project details feature
    /contact           # Contact feature
  /hooks               # Global custom hooks
  /layouts             # Layout components
  /lib                 # External library wrappers
  /pages               # Page components
  /services            # Services for API calls
  /utils               # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies
   ```
   npm install
   ```

2. Set up environment variables
   - Create a `.env` file in the root directory
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Build for production
   ```
   npm run build
   ```

### Features

- **Dark/Light Theme**: Toggle between space-themed dark mode and light mode
- **Interactive Elements**: Animated planets and space backgrounds
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Project Showcase**: Detailed project pages
- **Admin Dashboard**: For content management (requires authentication)

### Main Components

- `SpaceCanvas`: Interactive canvas with orbiting planets
- `ProjectPlanet`: Interactive planet components representing projects
- `ProjectHeader`: Header component for project details
- `ProjectDetails`: Project information display
- `AdminDashboard`: Admin interface for content management
- `ContactForm`: Form for sending messages

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint for code linting
- `npm run test`: Run tests

## Dependencies

- React
- React Router
- Axios for API calls
- SASS/SCSS for styling
- Vite for development and building