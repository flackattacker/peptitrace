# PeptiTrace - Anonymous Peptide Experience Platform

PeptideXP is an open-source, anonymous platform where users can share their peptide experiences and explore aggregated community data. The application prioritizes privacy, simplicity, and community-driven insights without requiring user registration.

## Overview

PeptideXP allows users to anonymously submit detailed personal stories and experiences with peptides, which can then be explored and analyzed through a comprehensive data dashboard. The application is designed with a mobile-first approach and includes robust privacy features to ensure user anonymity.

### Architecture and Technologies

**Frontend:**
- **ReactJS** with Vite: Modern frontend framework and build tool.
- **Tailwind CSS**: For styling with utility-first CSS classes.
- **shadcn-ui**: Component library used for UI elements.
- **client-side routing**: Managed by `react-router-dom`.

**Backend:**
- **Express.js**: For building the RESTful API.
- **MongoDB** with Mongoose: NoSQL database for storing user experiences, peptides, and analytics.
- **Token-based Authentication**: Using JWTs (JSON Web Tokens) for securing endpoints.

### Project Structure

The project is divided into two main parts:

**Frontend (client/):**
- All frontend code is located in the `client/` directory.
- Key components and pages are in `client/src/components` and `client/src/pages`.
- API requests are handled in `client/src/api`.

**Backend (server/):**
- All backend code resides in the `server/` directory.
- Routes for API endpoints are defined in `server/routes`.
- Models and services are located in `server/models` and `server/services`.

## Features

### Core User Flows

1. **Anonymous Experience Submission:**
    - Users can submit their peptide experiences through a multi-step form.
    - No registration required; privacy-first approach.
    - Submission includes peptide details, context and goals, outcomes and effects, and a detailed personal story.

2. **Data Exploration Dashboard:**
    - Interactive visualization hub for exploring community data.
    - Various filters and visualization options to compare peptides, analyze trends, and read personal stories.

3. **Community Features:**
    - Peer review system for rating experiences.
    - Discussion forums and Q&A sections for community interaction.
    - Recognition for valuable contributions.

4. **Privacy-First Features:**
    - Strong data control and anonymity features.
    - Options for story pseudonymization and anonymous follow-ups.

5. **Advanced Analysis Tools:**
    - Pattern recognition and AI-powered insights.
    - Research export interfaces and tools for deeper academic analysis.

## Getting Started

### Requirements

To run the project locally, you need:
- **Node.js** (v14.x or above)
- **npm** (v6.x or above)
- **MongoDB** (installed and running locally or accessible remotely)

### Quickstart

1. **Clone the repository:**
    ```
    git clone https://github.com/yourusername/peptidexp.git
    cd peptidexp
    ```

2. **Install dependencies:**
    ```
    npm install
    ```

3. **Set up MongoDB:**
    - Ensure MongoDB is running and accessible.
    - Configure the MongoDB connection URI in `server/.env`.

4. **Start the application:**
    ```
    npm run start
    ```

5. **Access the app:**
    - Frontend: `http://localhost:5173`
    - Backend API: `http://localhost:3000/api`

### License

```markdown
The project is proprietary.

```

This file provides a concise yet detailed overview of the PeptideXP platform, its features, and instructions to get started with development or usage.
