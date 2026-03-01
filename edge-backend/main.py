from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI(title="Edge-AI Neurodivergence Engine")

# Crucial: Enable CORS so the React Extension can securely POST from any web origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama endpoint & ultra-fast local model
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "phi3:mini" # Make sure to run `ollama run phi3:mini` in your terminal beforehand

class SimplifyRequest(BaseModel):
    text: str

class SimplifyResponse(BaseModel):
    simplified_text: str

@app.post("/simplify", response_model=SimplifyResponse)
async def simplify_text(req: SimplifyRequest):
    """
    Receives complex text, builds a strict zero-shot prompt, and processes 
    it via local AMD hardware. ZERO cloud API calls ensures absolute privacy.
    """
    prompt = f"Rewrite this text to be extremely simple and easy to understand for someone with cognitive load issues. Keep it concise. Output ONLY the rewritten text: {req.text}"

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False  # Send back as a single chunk to the UI immediately
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        simplified = data.get("response", "").strip()
        
        return SimplifyResponse(simplified_text=simplified)
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Local LLM Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Boot the bridge on port 8000
    uvicorn.run(app, host="127.0.0.1", port=8000)
