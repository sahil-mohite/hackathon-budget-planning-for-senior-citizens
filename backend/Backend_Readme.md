Run the following commands

python -m venv venv

venv/Scripts/activate.bat

pip install -r ./backend/requirements.txt

uvicorn image_text_processor:app --reload --port 8000
uvicorn insights:router --reload --port 8080
uvicorn user:app --reload --port 8050
