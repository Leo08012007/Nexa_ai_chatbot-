# Intelligent Chatbot System using Python and OpenAI API

**College AIT Practical Laboratory Task 9**  
**Application Name:** NEXA AI – Intelligent Chat Assistant

---

## 🎯 Project Objective

To build an intelligent conversational chatbot system that accepts natural-language user queries, processes them using an OpenAI language model via Python and FastAPI, maintains conversation context memory across multi-turn dialogues, and presents responses through a modern, interactive web interface.

---

## 🏗️ System Architecture

```
                                  +-----------------------+
                                  |     User Interface    |
                                  |   (React + Vite UI)   |
                                  +-----------+-----------+
                                              |
                                   HTTP POST /api/chat
                                              v
                                  +-----------+-----------+
                                  |   FastAPI Python      |
                                  |      Backend          |
                                  +-----------+-----------+
                                              |
                                      OpenAI Python SDK
                                              v
                                  +-----------+-----------+
                                  |    OpenAI API Engine  |
                                  |     (gpt-4o-mini)     |
                                  +-----------+-----------+
                                              |
                                      Generated Response
                                              v
                                  +-----------+-----------+
                                  |   FastAPI Context     |
                                  |   State Storage       |
                                  +-----------+-----------+
                                              |
                                    Formatted JSON Data
                                              v
                                  +-----------+-----------+
                                  |     User Interface    |
                                  |    (Markdown & Code)  |
                                  +-----------------------+
```

---

## ✨ Features

- **End-to-End Generative AI:** Real-time conversational AI powered by OpenAI's official Python SDK.
- **Contextual Memory:** Backend retains full multi-turn chat history per `conversation_id` so the chatbot understands relative follow-up questions (e.g., *"What is ML?"* ➔ *"Give me an example"*).
- **Futuristic Glassmorphism UI:** Dark theme built with React, Vite, Tailwind CSS, Lucide icons, and smooth micro-animations.
- **Interactive Suggestion Cards:** Quick-start prompts for Artificial Intelligence, Natural Language Processing, Machine Learning, and Python programming.
- **Markdown & Code Syntax Highlighting:** AI responses format headings, bullet lists, tables, and code snippets with single-click Copy Code functionality.
- **Conversation Management:** Start new chats, clear history with confirmation dialogs, search past conversations, and export transcript logs as `.txt` files.
- **Robust Error Handling:** Graceful API key detection, fallback fallback mode for dev/offline testing, rate limit detection, and user-friendly error notifications.
- **Fully Responsive & Accessible:** Responsive drawer layout for mobile, tablet, and desktop screens with full keyboard navigation support (`Enter` to send, `Shift+Enter` for newlines).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 (Vite) |
| **Styling & Icons** | Tailwind CSS & Lucide React |
| **Markdown Rendering** | `react-markdown` + `remark-gfm` |
| **Backend Framework** | Python 3.10+ & FastAPI |
| **ASGI Server** | Uvicorn |
| **AI SDK & Model** | OpenAI Python SDK (`openai>=1.14.0`) using `gpt-4o-mini` |
| **Environment Config** | `python-dotenv` |

---

## 📁 Project Structure

```
ai_chat/
│
├── backend/
│   ├── main.py              # FastAPI application server & chat logic
│   ├── requirements.txt     # Python backend dependencies
│   ├── .env                 # Environment file storing OPENAI_API_KEY (Ignored in Git)
│   └── .env.example         # Example configuration template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInput.jsx        # Floating auto-resizing input box
│   │   │   ├── ChatMessage.jsx      # User bubble & AI Markdown code renderer
│   │   │   ├── ClearModal.jsx       # Clear chat confirmation dialog
│   │   │   ├── Header.jsx           # Top navbar with status & actions
│   │   │   ├── HelpModal.jsx        # Viva study guide & architecture modal
│   │   │   ├── SettingsModal.jsx    # System prompt & API status settings
│   │   │   ├── Sidebar.jsx          # Chat history sidebar & search bar
│   │   │   └── WelcomeScreen.jsx    # Empty state with 4 suggestion prompt cards
│   │   ├── App.jsx                  # Main React state & API integration
│   │   ├── index.css                # Custom glassmorphism styles & scrollbars
│   │   └── main.jsx                 # React DOM root entrypoint
│   ├── index.html                   # HTML template
│   ├── package.json                 # Node dependencies
│   └── tailwind.config.js           # Tailwind configuration
│
├── README.md                        # Project documentation & viva guide
└── .gitignore                       # Git ignore rules for node_modules & .env
```

---

## 🚀 Step-by-Step Installation & Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Python 3.10+**: `python --version`
- **Node.js 18+**: `node -v`

---

### 2. Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. (Optional but recommended) Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure your OpenAI API Key:
   - Create a `.env` file in `backend/` by copying `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Open `backend/.env` and insert your OpenAI API key:
     ```env
     OPENAI_API_KEY=sk-proj-your-actual-api-key-here
     OPENAI_MODEL=gpt-4o-mini
     ```

5. Start the FastAPI backend server:
   ```bash
   python main.py
   # Or using uvicorn directly:
   uvicorn main:app --reload --port 8000
   ```
   *The backend will start running at `http://127.0.0.1:8000`.*

---

### 3. Frontend Setup (React + Vite)

1. Open a second terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The React interface will be accessible at `http://localhost:5173`.*

---

## 📡 API Endpoints

| Method | Endpoint | Description | Request Body / Parameters |
|---|---|---|---|
| `GET` | `/api/health` | Backend status & OpenAI config check | None |
| `POST` | `/api/chat` | Send message & receive AI response | `{ "message": "string", "conversation_id": "string" }` |
| `GET` | `/api/conversations` | Retrieve recent conversation list | None |
| `GET` | `/api/conversations/{id}` | Fetch full transcript history for ID | Path parameter: `id` |
| `DELETE`| `/api/conversations/{id}` | Delete a conversation session | Path parameter: `id` |
| `POST` | `/api/conversations/clear` | Clear all stored conversations | None |

---

## 🎓 College Practical Viva Q&A Guide

During your AIT practical viva, the external examiner may ask questions about this project. Here are the answers:

### 1. What is a Chatbot?
An intelligent software application designed to simulate natural human conversation via text or voice interactions using AI and Natural Language Processing.

### 2. What is Natural Language Processing (NLP)?
NLP is a branch of Artificial Intelligence concerned with enabling computers to understand, parse, interpret, and generate natural human text and speech.

### 3. What is the OpenAI API?
An API provided by OpenAI that gives developers access to state-of-the-art Large Language Models (such as `gpt-4o-mini`) to perform text generation, code synthesis, and semantic extraction.

### 4. Why is Python used for the backend?
Python provides official OpenAI SDK support, rich machine learning libraries, simplicity, and fast data manipulation capabilities.

### 5. Why is FastAPI used instead of Flask/Django?
FastAPI is an asynchronous framework built on Starlette and Pydantic. It offers automatic OpenAPI documentation (`/docs`), strict data validation, and superior request execution speed.

### 6. Why is React used for the frontend?
React provides component-based state management, enabling seamless user interface updates, smooth scrolling, and dynamic chat bubbles without reloading the web page.

### 7. How does a user message reach the AI?
The user inputs text in React ➔ React makes an HTTP POST fetch request to `/api/chat` ➔ FastAPI validates input with Pydantic ➔ FastAPI calls `openai.chat.completions.create` ➔ OpenAI LLM processes prompt and generates output ➔ FastAPI returns JSON ➔ React renders markdown response.

### 8. How is conversation context maintained?
The backend maintains a list of messages for each `conversation_id`. With every new user message, the backend prepends the system instruction and past turn history before calling OpenAI API. This allows the model to understand context-dependent follow-up questions.

### 9. What is Semantic Flow and Text Mining in this task?
Semantic flow refers to tracking how topics and context evolve sequentially across turns in a conversation. Text mining frameworks extract meaning from raw natural language queries to infer intent rather than performing simple substring matches.

### 10. What is the role of the System Prompt?
The system prompt defines the AI's persona, rules, boundaries, and communication style. In NEXA AI, it instructs the bot to be professional, educational, concise, and helpful.

### 11. What happens if the API key fails or network drops?
The application catches exceptions (such as `AuthenticationError` or `RateLimitError`), logs details privately on the server console, and presents a clean error banner to the user without exposing internal stack traces or keys.

---


