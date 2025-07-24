Run the following commands

python -m venv venv

venv/Scripts/activate

pip install -r requirements.txt

uvicorn image_text_processor:app --reload --port 8000
uvicorn insights:router --reload --port 8080
uvicorn voice_converter:router --reload --port 8090
uvicorn user:app --reload --port 8050
