
# Project Management Application

## Overview

This Nuxt 3 based project management application is designed to streamline team collaboration and project tracking. It includes functionalities similar to popular tools like Asana.

## Project Structure

- `assets`: Contains static resources for the application, primarily stylesheets.
- `components`: Reusable Vue components. Each component is automatically imported where needed, thanks to Nuxt 3's auto-import feature.
- `pages`: Each Vue file in this directory corresponds to a route. Nuxt handles routing automatically based on the file structure.
- `server`: Contains a mock server implementation using JSON Server to simulate API calls and responses.
- `utils`: Utility functions that provide additional functionality across various components and pages.

## Local Setup

### Prerequisites
- Node.js (version 12.x or higher)
- npm (version 6.x or higher)

### Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory and install the dependencies:
   ```
   npm install
   ```

### Running the Application

1. Start the development server:
   ```
   npm run dev
   ```

This command serves the app at `http://localhost:3000` and provides hot reloading.

### Running the JSON Server

1. To simulate the backend, we use JSON Server, which reads from the `server/db.json` file.
2. Start the JSON Server:
   ```
   npm run json-server
   ```

This will host the mock API on `http://localhost:4000` by default. The data structure and endpoints are defined in `db.json`.

## File Descriptions

- `.gitignore` - Specifies intentionally untracked files to ignore.
- `app.vue` - The main application component.
- `nuxt.config.ts` - Configuration file for Nuxt-specific settings.
- `tailwind.config.js` - Configuration for Tailwind CSS, which handles styling.
- `tsconfig.json` - Contains TypeScript's compiler options.
- `package.json` - Lists the project dependencies and scripts.

## Working with the Application

- **Components**: Each component under the `components` folder is self-contained, with its own styling and logic.
- **Pages**: Files in the `pages` directory automatically become routes. For instance, `pages/index.vue` corresponds to the root URL.

## Contribution Guidelines

Contributors are encouraged to follow standard coding practices and submit changes via pull requests.

## License

The project is licensed under the MIT License. Please see the `LICENSE.md` file for more details.
