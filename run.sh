#!/bin/bash
cd ./backend/
# Start venv
venv/Scripts/activate.bat &

# Start image_text_processor on port 8000
uvicorn image_text_processor:app --reload --port 8000 &

# Start insights on port 8090
uvicorn insights:app --reload --port 8090 &

# Start user on port 8050
uvicorn user:app --reload --port 8050 &

# Optional: wait for all background processes to finish
wait