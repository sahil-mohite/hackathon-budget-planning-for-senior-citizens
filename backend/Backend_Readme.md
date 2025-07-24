Run the following commands

python -m venv venv

venv/Scripts/activate

pip install -r ./backend/requirements.txt

uvicorn main:app --reload --port 8000
uvicorn insights:router --reload --port 8080
uvicorn voice_converter:router --reload --port 8090
