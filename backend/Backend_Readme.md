Run the following commands

python -m venv venv

venv/Scripts/activate.bat


pip install -r ./backend/requirements.txt

uvicorn image_text_processor:app --reload --port 8000
uvicorn insights:app --reload --port 8090
uvicorn user:app --reload --port 8050
