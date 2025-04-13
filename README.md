# Trace API-Server Frontend

A React-based frontend application for managing instructors, courses, and trace surveys.

## Overview

This application provides a user interface for interacting with the Trace Survey API, allowing users to:

- Create and manage user accounts
- Add, edit, and delete instructors
- Create, update, and manage courses
- Upload and manage trace survey PDFs
- View relationships between courses, instructors, and surveys

## Project Structure

```
trace-frontend/
├── public/                 # Static files
├── src/                    # Source code
│   ├── api/                # API service functions
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Shared components (AppBar, Drawer, etc.)
│   │   ├── course/         # Course-related components
│   │   ├── instructor/     # Instructor-related components
│   │   └── trace/          # Trace survey components
│   ├── contexts/           # React context providers
│   ├── pages/              # Main application pages
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── .gitignore              # Git ignore file
├── index.html              # HTML entry point
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Prerequisites

- Node.js (v16 or later)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cyse7125-sp25-team03/trace-frontend.git
   cd trace-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

The application is configured to connect to the API server at `https://api-server.prd.gcp.csyeteam03.xyz`. If you need to use a different API URL, update the `src/api/axiosConfig.ts` file.

## Running the Application

### Development Mode

Start the development server with:

```bash
npm run dev
```

This will start the application on `http://localhost:3000` with hot reloading enabled.

### Production Build (Local Testing)

To create and test a production build locally:

```bash
npm run build
npm run preview
```

This will create an optimized production build and serve it locally.

## Using the Application

1. **Authentication**
   - Register a new account on the signup page
   - Log in with your credentials

2. **Managing Instructors**
   - View all instructors on the Instructors page
   - Add a new instructor with the "Add Instructor" button
   - Edit or delete instructors using the action buttons

3. **Managing Courses**
   - Create courses with instructor and department information
   - View all courses on the Courses page
   - Edit or delete courses as needed

4. **Working with Trace Surveys**
   - Navigate to a course to view its trace surveys
   - Upload PDF trace surveys for specific courses
   - View all traces across the system on the Traces page

## Troubleshooting

### API Connection Issues

If you encounter SSL certificate issues with the API:

1. For local development, the app uses a proxy to bypass certificate issues
2. Check that the API server is running and accessible

### Authentication Problems

If you have issues with authentication:

1. Make sure you're using a valid email format for the username
2. Check that the password meets minimum requirements
3. Verify that the API server is properly configured for authentication

### File Upload Issues

If you have problems uploading trace surveys:

1. Ensure you're uploading PDF files
2. Check file size (keep files under 10MB)
3. Verify that all required fields are filled in the upload form

## Development Notes

- The application uses React with TypeScript for type safety
- Vite is used as the build tool for fast development and optimized builds
- Material UI provides the component library for consistent styling
- Axios handles API requests with interceptors for authentication
- React Router manages navigation between different parts of the application