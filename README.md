# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/defe851f-4645-4efc-bbee-d2d95f8fca0b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/defe851f-4645-4efc-bbee-d2d95f8fca0b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/defe851f-4645-4efc-bbee-d2d95f8fca0b) and click on Share -> Publish.


# Opportunity Match Platform

A full-stack job application platform for recruiters and applicants, built with React, Node.js, Express, and MongoDB.

## Features

### For Applicants

- Register and log in as an applicant
- Edit and update your full profile (name, phone, skills, experience, etc.)
- Search and apply for jobs
- View your application history and the status of each application (applied, shortlisted, accepted, cancelled)

### For Recruiters

- Register and log in as a recruiter
- Post, edit, and delete jobs (manage only your own jobs)
- View all applicants for your jobs, including full candidate profiles
- Shortlist, accept, or cancel applications; status is tracked and visible to both recruiter and applicant

### General

- Secure authentication and role-based access
- Modern, responsive UI with dashboards for both applicants and recruiters
- Robust backend API with MongoDB for data persistence

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB (Mongoose)

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/varshini-m0510/opportunity-match-platform.git
   cd opportunity-match-platform
   ```

2. **Install dependencies:**

   ```sh
   npm install
   cd server && npm install
   cd ..
   ```

3. **Start MongoDB:**

   - Make sure MongoDB is running locally on `mongodb://localhost:27017/opportunity-match`

4. **Run the backend server:**

   ```sh
   cd server
   npm start
   ```

5. **Run the frontend app:**

   ```sh
   cd ..
   npm run dev
   ```

6. **Open in your browser:**

   - Visit [http://localhost:5173](http://localhost:5173)

## Folder Structure

```
.
├── public/
├── server/           # Express backend
│   └── index.js
├── src/              # React frontend
│   ├── pages/
│   └── components/
├── package.json
├── README.md
└── ...
```

## API Endpoints (Summary)

- `POST /api/register` — Register as applicant or recruiter
- `POST /api/login` — Login
- `POST /api/jobs` — Post a job (recruiter)
- `PUT /api/jobs/:jobId` — Edit a job (recruiter)
- `DELETE /api/jobs/:jobId` — Delete a job (recruiter)
- `GET /api/jobs` — List all jobs
- `POST /api/apply` — Apply to a job (applicant)
- `GET /api/recruiter/:recruiterId/jobs` — Recruiter's jobs
- `GET /api/jobs/:jobId/applicants` — Applicants for a job
- `POST /api/jobs/:jobId/applicants/:userId` — Update application status (shortlist, accept, cancel)
- `GET /api/users/:userId/applications` — Applicant's application history
- `GET /api/jobs/:jobId/applicants/:userId/status` — Status of a specific application

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

---

**Made with ❤️ for connecting talent and opportunity.**
