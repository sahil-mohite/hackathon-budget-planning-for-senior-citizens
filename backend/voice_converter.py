# voice.py
import os
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Initialize FastAPI Router ---
router = APIRouter()

# --- Configuration ---
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

# --- Configure Gemini API ---
if GOOGLE_API_KEY:
    try:
        genai.configure(api_key=GOOGLE_API_KEY)
    except Exception as e:
        print(f"Error configuring Gemini API: {e}")
else:
    print("GOOGLE_API_KEY not found. Voice endpoint will not work.")

# --- Pydantic Models ---
class TranscriptionResponse(BaseModel):
    text: str

# --- API Endpoint ---
@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_voice(
    audio_file: UploadFile = File(...)
):
    """
    Accepts an audio file (e.g., mp3, wav, m4a) and returns the transcribed text.
    """
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=503, detail="AI Service is not configured on the server.")

    # Validate that the uploaded file is an audio file
    if not audio_file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail=f"Invalid file type. Please upload an audio file, not {audio_file.content_type}.")

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Read the audio file bytes
        audio_bytes = await audio_file.read()

        # Send the audio bytes directly to Gemini for transcription
        response = await model.generate_content_async(
            [
                "Please transcribe this audio file. If not clear return null", # Simple prompt for transcription
                {"mime_type": audio_file.content_type, "data": audio_bytes}
            ]
        )

        transcribed_text = response.text

    except Exception as e:
        # Catch potential errors from the API call
        raise HTTPException(status_code=500, detail=f"An error occurred during transcription: {e}")

    return TranscriptionResponse(text=transcribed_text)
