# TaskFlow AI - Full Stack Task Manager

TaskFlow AI is a modern, full-stack Task Manager web application built with the MERN stack. It features a beautiful Glassmorphism UI, a drag-and-drop Kanban board, Dark/Light mode, and an AI-powered task generator.

## 🚀 Live Demo
*Insert your deployed live URL here* 
*Insert your Loom video link here (Optional but recommended)*

## ✨ Features
- **Full CRUD:** Create, Read, Update, and Delete tasks.
- **AI Task Suggestion:** Enter a rough title, and Google Gemini AI automatically generates a professional description and suggests a priority level.
- **Kanban Board:** Drag and drop tasks across "To Do", "In Progress", and "Done" columns.
- **Visual Status Indicators:** Glowing dots and borders indicate task status, turning red if a task is overdue.
- **Modern UI/UX:** Responsive Glassmorphism design with full Dark/Light mode toggling.
- **Secure Authentication:** JWT-based user login and signup.

---

## 🛠️ Tech Stack & Choices

I chose the **MERN** stack (MongoDB, Express, React, Node.js) combined with **Tailwind CSS** because it allows for rapid, component-driven development while maintaining a clean separation of concerns.

*   **Frontend:** React.js
    *   *Why:* React's state management is perfect for handling instant UI updates required by the drag-and-drop Kanban board.
*   **Styling:** Tailwind CSS
    *   *Why:* Enabled the rapid creation of complex Glassmorphism UI and Dark Mode utility classes without leaving the JSX.
*   **Backend:** Node.js & Express
    *   *Why:* Lightweight and fast, making it easy to create RESTful API endpoints and securely handle the AI API requests.
*   **Database:** MongoDB
    *   *Why:* NoSQL flexibility is great for task objects, allowing for fast iteration of the schema.
*   **Drag & Drop:** `@hello-pangea/dnd`
    *   *Why:* A modern, actively maintained fork of `react-beautiful-dnd` that perfectly supports React 18 strict mode.

---

## 🤖 AI Integration

This project integrates the **Google Gemini API** (`gemini-1.5-flash` model). 
*   **How it works:** When a user types a rough task title and clicks the "AI Suggest" button, the frontend sends the title to a protected backend route. 
*   **Security:** The `GEMINI_API_KEY` is securely stored in the backend `.env` file and is never exposed to the client. The backend formats a strict prompt instructing the AI to return a JSON object containing a professional description and priority level, which is then parsed and sent back to populate the frontend form.

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js installed
- A MongoDB cluster (Atlas) or local MongoDB server
- A free Google Gemini API Key

### 1. Clone the repository
```bash
git clone <your-repo-link>
cd task-manager