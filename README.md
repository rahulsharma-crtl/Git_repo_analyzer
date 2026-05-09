# GitHub Insight Engine

A full-stack web application that provides deep analytics for GitHub profiles. It demonstrates a hybrid API architecture combining REST for system management and GraphQL for data aggregation.

## Architecture: Hybrid REST & GraphQL

This project intentionally uses a **hybrid API approach**:
- **REST API Layer**: Used for system management tasks, specifically user authentication (Registration and Login). These operations are straightforward, stateless (JWT), and well-suited for traditional RESTful endpoints.
- **GraphQL Layer**: Used internally by the backend data fetcher service to communicate with the GitHub API. GraphQL is ideal here because it prevents over-fetching and under-fetching. A single complex query fetches user metadata, repository details, languages, and contribution history all at once, which is then mapped into a simplified JSON object for the frontend.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- A GitHub Personal Access Token (PAT)

### How to get a GitHub Personal Access Token
To use the analytics features, you need a GitHub PAT:
1. Go to your GitHub account settings.
2. Navigate to **Developer settings** > **Personal access tokens** > **Tokens (classic)**.
3. Click **Generate new token (classic)**.
4. Give it a descriptive note (e.g., "Insight Engine").
5. Under **Select scopes**, check the `read:user` and `repo` scopes.
6. Click **Generate token**.
7. Copy the token immediately (you won't be able to see it again).

### Installation

1. Clone this repository.
2. Setup the backend:
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env and paste your GitHub token into GITHUB_TOKEN
   npm start
   ```
3. Setup the frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Features
- **Authentication**: JWT-based stateless session management.
- **Search Dashboard**: Search any GitHub username to view analytics.
- **Visualizations**: 
  - Language Distribution Pie Chart
  - Repository Statistics Bar Chart
- **API Documentation**: Swagger UI available at `http://localhost:5000/api-docs`.
