# NanoCraft

<div align="center">
  

### Structured Knowledge from Raw Instructions

_The missing piece in your DIY journey. Transform any DIY URL into a pristine, visual-first learning guide using NanoCraft._

</div>

---

## About The Project

NanoCraft is an AI-powered web application designed to simplify learning for makers, creators, and DIY enthusiasts. It takes an existing DIY guide such as an Instructables URL scrapes its content, and leverages Google Gemini to transform dense, raw text into a structured, step-by-step visual guide. Additionally, NanoCraft automatically generates relevant scene images for each step using Cloudflare Workers AI and provides a context-aware AI chatbot to answer any questions you might have about the project.

## Installation & Setup

Follow these detailed instructions to set up NanoCraft locally.

### 1. Clone the Repository

```bash
git clone https://github.com/vynride/NanoCraft.git
cd NanoCraft
```

### 2. Environment Variables

Navigate to the `backend` directory and set up your environment variables.
You can use the provided `.env.example` as a reference.

```bash
cd backend
cp .env.example .env
```

You will need to acquire API keys for the following services:

- **Google Gemini**: Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
- **Cloudflare Workers AI**: Get your setup details from the [Cloudflare Developer Portal](https://developers.cloudflare.com/workers-ai/get-started/rest-api/).
- **MongoDB Atlas**: Set up a free cluster on [MongoDB](https://www.mongodb.com/cloud/atlas) and get your connection string.

Update the `.env` file with these credentials.

### 3. Backend Setup

While still in the `backend` directory, create and activate a Python virtual environment, then install the dependencies:

```bash
# Create a virtual environment
python3 -m venv .venv

# Activate the virtual environment
# On Linux/macOS:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### 4. Frontend Setup

Open a new terminal, navigate to the `frontend` directory, and install the Node.js packages:

```bash
cd frontend
npm install
```

### 5. Running the Application

- **Backend**: Run the FastAPI server inside your activated virtual environment:
  ```bash
  uvicorn main:app --reload
  ```
- **Frontend**: Start the Vite development server:
  ```bash
  npm run dev
  ```

---

## Architecture & Flow

NanoCraft is composed of a decoupled frontend and backend that communicate via REST APIs.

### Application Flow

1. **Input Submission**: A user pastes a DIY project URL into the frontend application.
2. **Scraping**: The React application sends a POST request to the FastAPI backend, which safely scrapes the target URL.
3. **Data Structuring**: The backend passes the scraped content to Google Gemini to extract a structured layout containing a project summary, a visual anchor, and individual steps with scene descriptions.
4. **Data Persistence**: The structured project data is stored in MongoDB.
5. **Image Generation**: The backend triggers an asynchronous background process that generates images for each step using Cloudflare Workers AI. These images are stored in MongoDB's GridFS.
6. **Polling & Rendering**: The frontend polls the backend and progressively renders the project instructions and generated images as they complete.
7. **Contextual Chat**: The user can interact with the DIY Chatbot natively integrated into the workspace sidebar, which utilizes project data and Gemini to answer specific questions about the materials and steps.

### Directory Structure

```text
NanoCraft/
├── backend/                  # FastAPI Application
│   ├── main.py               # Entry point, routing, and background generation tasks
│   ├── db/                   # MongoDB connection and GridFS operations
│   ├── models/               # Pydantic models (Instruction, Project, Step)
│   ├── utils/                # Integrations (scraper.py, gemini.py, workers.py, chat.py)
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Template for environment variables
└── frontend/                 # React & Vite Application
    ├── index.html            # Main HTML with SEO tags
    ├── package.json          # Node dependencies
    ├── src/
    │   ├── pages/            # Top-level view components (Landing, Workspace, Chat)
    │   ├── components/       # Reusable UI elements (Sidebar, Logo, SEOHead)
    │   └── services/         # API abstraction layer
    └── public/               # Static assets
```

## Built With

- **Frontend**: React, Vite, React Router, TailwindCSS.
- **Backend**: Python, FastAPI.
- **Database**: MongoDB (Atlas) & GridFS.
- **AI Services**: Google Gemini API, Cloudflare Workers AI.
