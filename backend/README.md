# Backend Setup

## Install
```bash
cd backend
python -m venv .venv
```

Activate the virtualenv:
- macOS/Linux
```bash
source .venv/bin/activate
```
- Windows (PowerShell)
```pwsh
.\.venv\Scripts\activate
```

Install dependencies:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## Run the API (dev)
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- Open http://localhost:8000 for the root response.
- Interactive docs available at http://localhost:8000/docs.
