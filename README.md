# TRACE Survey Management System

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI-0081CB?style=for-the-badge&logo=mui&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![PDF](https://img.shields.io/badge/PDF_Viewer-EC1C24?style=for-the-badge&logo=adobe-acrobat-reader&logoColor=white)

A comprehensive frontend application for managing TRACE survey data, instructors, courses, and survey PDFs.

## Overview

The TRACE Survey Management System provides a modern, intuitive interface for educators and administrators to manage TRACE survey data. This application connects to the [TRACE API Server](https://github.com/cyse7125-sp25-team03/api-server.git) to allow users to create and manage instructors, courses, and upload/view TRACE survey PDFs.

<!--
## Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Course Management
![Course Management](screenshots/courses.png)

### Instructor Management
![Instructor Management](screenshots/instructors.png)

### TRACE Survey Viewer
![TRACE Survey Viewer](screenshots/survey-viewer.png)
-->

## Features

- **User Authentication**: Secure login and signup with email validation
- **Instructor Management**: Create, edit, view, and delete instructor profiles
- **Course Management**: Create, edit, and manage courses with detailed information
- **Department Integration**: Built-in department selection for course organization
- **TRACE Survey Management**: Upload, view, and delete TRACE survey PDFs
- **PDF Viewer**: In-app viewing of TRACE survey PDFs with download option
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Material Design**: Clean, modern UI based on Material UI components

## Tech Stack

- **React**: Frontend library for building the user interface
- **TypeScript**: Type safety for JavaScript
- **Vite**: Modern frontend tooling for development and building
- **Material UI**: Component library for the user interface
- **Axios**: HTTP client for API communication
- **React Router**: For navigation and routing
- **Local Storage**: For persisting authentication data

## Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Access to the TRACE API Server

## Installation

1. Clone the repository:
```bash
git clone https://github.com/cyse7125-sp25-team03/trace-frontend.git
cd trace-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

## Running Locally

Start the development server:
```bash
npm run dev
# or
yarn dev
```

This will start the application on `http://localhost:3000` by default, with proxy settings configured to connect to the API server.

## Building for Production

Create a production build:
```bash
npm run build
# or
yarn build
```

Preview the production build locally:
```bash
npm run preview
# or
yarn preview
```

## Deployment

### Deploying to Vercel

1. Create a `vercel.json` file in the root directory with the following content:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://api-server.prd.gcp.csyeteam03.xyz/$1"
    }
  ]
}
```

2. Push your code to a Git repository (GitHub, GitLab, etc.)

3. Connect your repository to Vercel:
   - Sign up for a Vercel account if you don't have one
   - Import your repository by clicking "Add New..." and selecting "Project"
   - Select your repository from the list
   - Use the default settings (Vercel should detect Vite automatically)
   - Click "Deploy"

4. For manual deployment using Vercel CLI:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy to preview environment
   vercel
   
   # Deploy to production
   vercel --prod
   ```

5. Your application will be available at the Vercel-assigned domain (e.g., `your-project.vercel.app`) and any custom domains you configure.

### API Proxy Configuration

The `vercel.json` configuration automatically handles API requests by:
- Capturing requests to `/api/*` paths
- Proxying them to the actual API server at `https://api-server.prd.gcp.csyeteam03.xyz`
- Handling SSL certificate validation
- Preserving request paths and parameters

This allows the frontend to make API calls without worrying about CORS or certificate issues.

## Project Structure

```
trace-frontend/
├── public/                 # Static files
├── src/
│   ├── api/                # API service functions
│   │   ├── authService.ts
│   │   ├── courseService.ts
│   │   ├── instructorService.ts
│   │   ├── traceService.ts
│   │   ├── departmentService.ts
│   │   ├── semesterService.ts
│   │   └── axiosConfig.ts
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Shared components
│   │   ├── course/         # Course-related components
│   │   ├── instructor/     # Instructor-related components
│   │   └── trace/          # Trace survey components
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── pages/              # Page components
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Entry point
├── index.html              # HTML template
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── vercel.json             # Vercel deployment configuration
└── package.json            # Project dependencies and scripts
```

## Configuration

### API Configuration

By default, the application is configured to connect to the TRACE API Server at:
- Development: Through a Vite proxy to avoid CORS issues (`/api` → `https://api-server.prd.gcp.csyeteam03.xyz`)
- Production: Through Vercel's rewrites to `https://api-server.prd.gcp.csyeteam03.xyz`

The proxy configuration for development is in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://api-server.prd.gcp.csyeteam03.xyz',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

For production, the Vercel rewrites handle this proxy functionality.

## Usage Guide

### Authentication

1. Register a new account with a valid email address and password
2. Log in with your credentials
3. The system uses Basic Authentication with the API server

### Instructor Management

From the dashboard:
1. Navigate to the "Instructors" section
2. View the list of instructors
3. Add new instructors with the "Add Instructor" button
4. Edit or delete instructors using the action buttons
5. Note: You cannot delete instructors associated with courses

### Course Management

From the dashboard:
1. Navigate to the "Courses" section
2. View your courses in a card layout
3. Create new courses with instructor and department information
4. Edit or delete courses as needed
5. Click on a course to see its details and associated TRACE surveys

### TRACE Survey Management

From a course detail page:
1. View all TRACE surveys for the selected course
2. Upload new TRACE surveys in PDF format
3. View PDFs directly in the application
4. Download or delete surveys as needed

## Related Repositories

This frontend application is part of the TRACE Application Suite:

- [api-server](https://github.com/cyse7125-sp25-team03/api-server.git) - Main API service backend
- [trace-processor](https://github.com/cyse7125-sp25-team03/trace-processor.git) - Processes trace surveys
- [trace-consumer](https://github.com/cyse7125-sp25-team03/trace-consumer.git) - Consumes processed trace data
- [embedding-service](https://github.com/cyse7125-sp25-team03/embedding-service.git) - Generates vector embeddings
- [trace-llm](https://github.com/cyse7125-sp25-team03/trace-llm.git) - Provides natural language interface
- [helm-charts](https://github.com/cyse7125-sp25-team03/helm-charts.git) - Helm charts for deployment

## Customization

### Theming

The application uses Material UI's theming system. To customize the look and feel:

1. Modify the theme configuration in `src/theme/theme.js`
2. Change colors, typography, and component styles
3. Add custom CSS in `src/index.css` for global styles

### Adding New Features

Extend the application by:

1. Adding new components in the appropriate directories
2. Creating new API services for additional endpoints
3. Adding new routes in `App.tsx`
4. Expanding the existing contexts or creating new ones

## Troubleshooting

### API Connection Issues

If you encounter connection problems:

1. Verify the API server is running and accessible
2. Check that the proxy configuration in `vite.config.ts` is correct
3. Look for CORS or SSL certificate errors in the browser console
4. Verify your authentication credentials if getting 401 errors

### PDF Viewer Issues

If PDFs don't display properly:

1. Make sure the browser supports PDF viewing
2. Check that the API endpoint for PDF retrieval is correct
3. Verify that authentication headers are being sent properly

### Instructor Deletion Errors

If you can't delete an instructor:

1. Make sure the instructor isn't associated with any courses
2. Delete or reassign any courses associated with the instructor first

## Browser Support

- **Recommended**: Chrome, Firefox, Edge, Safari (latest versions)
- **Minimum Required**: Browsers with ES6 support

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.