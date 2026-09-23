# Day 3 local chat backend

A small FastAPI backend for a local educational chat application. It makes one Groq chat completion request for each submitted turn. The Day 2 GitHub Pages site remains separate; GitHub Pages cannot run this Python server.

## Run locally (Python 3.12)

From the repository root, enter `day3/` and create a virtual environment:

```bash
cd day3
python -m venv .venv
```

Activate it on Windows PowerShell with `.venv\Scripts\Activate.ps1`, or on macOS/Linux with `source .venv/bin/activate`. Then run:

```bash
python -m pip install -r requirements.txt
```

Copy `.env.example` to `.env` inside `day3/`. Set `GROQ_API_KEY` to your own key and `GROQ_MODEL` to the currently available model ID provided by your instructor. You may instead set both environment variables in your shell. Keep `.env` private and out of Git. Start the API from `day3/`:

```bash
python -m uvicorn app:app --host 127.0.0.1 --port 8000
```

Open <http://127.0.0.1:8000/docs> for the interactive API. `GET /api/health` reports whether both settings are present without contacting Groq. Example chat request:

```json
{"messages":[{"role":"user","content":"Hello"}]}
```

Send that JSON to `POST http://127.0.0.1:8000/api/chat`. The response has `reply` and `model` fields. Include previous `user` and `assistant` messages when continuing a conversation; the last message must be from `user`. The API accepts up to 20 messages, 2,000 characters per message, and 12,000 characters in total. The server adds its own instruction and caps output at 512 tokens. A real chat request needs working credentials and a supported model; the health check does not verify either with Groq.

The server binds only to localhost. If a browser page served from another origin needs to call it, configure a suitable local origin policy before connecting the frontend; no browser integration is included here.
