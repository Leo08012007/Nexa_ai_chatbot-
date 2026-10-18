import os
import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv, find_dotenv

from ai_engine import ai_engine_manager

# Locate and load .env file from backend directory explicitly
env_path = find_dotenv(usecwd=True)
if not env_path:
    env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path, override=True)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nexa_backend")

# Initialize FastAPI App
app = FastAPI(
    title="NEXA AI Chatbot API",
    description="Intelligent Chatbot Backend with Multi-Provider Support and Smart Resilient Fallback",
    version="2.0.0"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# System Prompt for NEXA AI
SYSTEM_PROMPT = (
    "You are NEXA AI, an intelligent, helpful and professional AI assistant. "
    "Provide accurate, clear and concise answers. Explain complex concepts in simple language when appropriate. "
    "Help users with education, programming, technology, general knowledge and problem solving. "
    "Maintain conversation context and respond naturally."
)

# In-Memory Storage for Conversations
conversations_db: Dict[str, Dict[str, Any]] = {}

# Pydantic Schemas
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Natural language prompt from user")
    conversation_id: Optional[str] = Field(None, description="Optional existing conversation ID")

class MessageItem(BaseModel):
    role: str
    content: str
    timestamp: str

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    title: str
    created_at: str
    messages: List[MessageItem]
    provider: Optional[str] = "smart_engine"
    model: Optional[str] = "gpt-4o-mini"
    mode: Optional[str] = "live"

class ConversationSummary(BaseModel):
    id: str
    title: str
    created_at: str
    message_count: int

class SettingsPayload(BaseModel):
    provider: Optional[str] = None
    openai_api_key: Optional[str] = None
    groq_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None
    openai_model: Optional[str] = None

class TestConnectionPayload(BaseModel):
    provider: str
    api_key: Optional[str] = ""
    model: Optional[str] = None

def mask_key(key: Optional[str]) -> Optional[str]:
    if not key or len(key) < 8:
        return None
    return f"{key[:6]}...{key[-4:]}"

def save_env_variable(var_name: str, var_val: str):
    """Safely updates or appends an environment variable in backend/.env"""
    target_env = os.path.join(os.path.dirname(__file__), ".env")
    lines = []
    found = False
    
    if os.path.exists(target_env):
        with open(target_env, "r", encoding="utf-8") as f:
            lines = f.readlines()
            
    new_lines = []
    for line in lines:
        if line.strip().startswith(f"{var_name}="):
            new_lines.append(f'{var_name}="{var_val}"\n')
            found = True
        else:
            new_lines.append(line)
            
    if not found:
        new_lines.append(f'{var_name}="{var_val}"\n')
        
    with open(target_env, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
        
    os.environ[var_name] = var_val

def generate_conversation_title(first_message: str) -> str:
    """Generates a short clean title from the user's first query."""
    clean_msg = first_message.strip()
    if len(clean_msg) <= 30:
        return clean_msg
    words = clean_msg.split()
    if len(words) <= 5:
        return clean_msg
    return " ".join(words[:5]) + "..."

# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health_check():
    """Health check endpoint to verify backend status."""
    openai_key = ai_engine_manager.get_openai_key()
    groq_key = ai_engine_manager.get_groq_key()
    gemini_key = ai_engine_manager.get_gemini_key()
    provider = os.getenv("AI_PROVIDER", "auto")

    return {
        "status": "online",
        "service": "NEXA AI Backend",
        "openai_configured": bool(openai_key),
        "groq_configured": bool(groq_key),
        "gemini_configured": bool(gemini_key),
        "provider": provider,
        "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/settings")
def get_settings():
    """Retrieves current AI settings and provider status."""
    openai_key = ai_engine_manager.get_openai_key()
    groq_key = ai_engine_manager.get_groq_key()
    gemini_key = ai_engine_manager.get_gemini_key()

    return {
        "provider": os.getenv("AI_PROVIDER", "auto"),
        "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        "openai_configured": bool(openai_key),
        "openai_preview": mask_key(openai_key),
        "groq_configured": bool(groq_key),
        "groq_preview": mask_key(groq_key),
        "gemini_configured": bool(gemini_key),
        "gemini_preview": mask_key(gemini_key),
        "smart_fallback_active": True
    }

@app.post("/api/settings")
def update_settings(payload: SettingsPayload):
    """Updates API keys and model preferences."""
    if payload.provider:
        save_env_variable("AI_PROVIDER", payload.provider)
    if payload.openai_api_key is not None:
        save_env_variable("OPENAI_API_KEY", payload.openai_api_key.strip())
    if payload.groq_api_key is not None:
        save_env_variable("GROQ_API_KEY", payload.groq_api_key.strip())
    if payload.gemini_api_key is not None:
        save_env_variable("GEMINI_API_KEY", payload.gemini_api_key.strip())
    if payload.openai_model:
        save_env_variable("OPENAI_MODEL", payload.openai_model.strip())

    ai_engine_manager.reset_quota_cache()
    return {"status": "success", "message": "Settings updated successfully"}

@app.post("/api/settings/test")
def test_connection(payload: TestConnectionPayload):
    """Tests connection to an AI provider."""
    result = ai_engine_manager.test_provider_connection(
        provider=payload.provider,
        api_key=payload.api_key or "",
        model=payload.model
    )
    return result

@app.get("/api/conversations", response_model=List[ConversationSummary])
def get_conversations():
    """Retrieves list of all stored conversations."""
    summaries = []
    sorted_convs = sorted(
        conversations_db.values(),
        key=lambda c: c.get("updated_at", c.get("created_at", "")),
        reverse=True
    )
    for conv in sorted_convs:
        summaries.append(ConversationSummary(
            id=conv["id"],
            title=conv["title"],
            created_at=conv["created_at"],
            message_count=len(conv["messages"])
        ))
    return summaries

@app.get("/api/conversations/{conversation_id}")
def get_conversation_history(conversation_id: str):
    """Retrieves full message history for a specific conversation."""
    if conversation_id not in conversations_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    return conversations_db[conversation_id]

@app.delete("/api/conversations/{conversation_id}")
def delete_conversation(conversation_id: str):
    """Deletes a conversation by ID."""
    if conversation_id in conversations_db:
        del conversations_db[conversation_id]
        return {"status": "deleted", "id": conversation_id}
    raise HTTPException(status_code=404, detail="Conversation not found")

@app.post("/api/conversations/clear")
def clear_all_conversations():
    """Clears all conversation history."""
    conversations_db.clear()
    return {"status": "all_cleared"}

@app.post("/api/chat", response_model=ChatResponse)
async def process_chat(request: ChatRequest):
    """
    Main Chat API Endpoint.
    - Manages conversation context memory
    - Queries configured AI Provider (OpenAI, Groq, Gemini)
    - If external API rate limit or quota occurs, seamlessly activates NEXA Smart Core
    - Returns structured response with conversation state
    """
    user_text = request.message.strip()
    if not user_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty."
        )

    # Resolve or create Conversation ID
    conv_id = request.conversation_id
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if not conv_id or conv_id not in conversations_db:
        conv_id = str(uuid.uuid4())
        conversations_db[conv_id] = {
            "id": conv_id,
            "title": generate_conversation_title(user_text),
            "created_at": current_time,
            "updated_at": current_time,
            "messages": []
        }

    conv = conversations_db[conv_id]
    
    # Append User Message to history
    user_msg_entry = {
        "role": "user",
        "content": user_text,
        "timestamp": current_time
    }
    conv["messages"].append(user_msg_entry)
    conv["updated_at"] = current_time

    # Generate response via resilient AI Engine Manager
    try:
        ai_response_text, provider_used, metadata = ai_engine_manager.generate_chat_response(
            messages_history=conv["messages"],
            system_prompt=SYSTEM_PROMPT
        )
    except Exception as e:
        logger.error(f"Chat generation unexpected exception: {e}")
        ai_response_text = (
            "I encountered a momentary issue processing your request. "
            "Please try rephrasing your message or check backend settings."
        )
        provider_used = "error_fallback"
        metadata = {"mode": "fallback"}

    # Append AI Response to history
    ai_msg_entry = {
        "role": "assistant",
        "content": ai_response_text,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    conv["messages"].append(ai_msg_entry)

    return ChatResponse(
        response=ai_response_text,
        conversation_id=conv_id,
        title=conv["title"],
        created_at=conv["created_at"],
        messages=conv["messages"],
        provider=provider_used,
        model=metadata.get("model", os.getenv("OPENAI_MODEL", "gpt-4o-mini")),
        mode=metadata.get("mode", "live")
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
