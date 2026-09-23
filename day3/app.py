"""Small local chat API for the Day 3 workshop."""

import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from groq import (
    APIConnectionError,
    APIStatusError,
    APITimeoutError,
    AsyncGroq,
    AuthenticationError,
    NotFoundError,
    PermissionDeniedError,
    RateLimitError,
)
from pydantic import BaseModel, ConfigDict, Field, model_validator

load_dotenv(Path(__file__).resolve().parent / ".env")

INSTRUCTION = (
    "You are a helpful educational assistant. Explain clearly, be concise, "
    "and acknowledge uncertainty."
)
MAX_MESSAGES = 20
MAX_TOTAL_CHARS = 12_000
app = FastAPI(title="Day 3 local chat API")


class Message(BaseModel):
    model_config = ConfigDict(extra="forbid")

    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=2_000)


class ChatRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    messages: list[Message] = Field(min_length=1, max_length=MAX_MESSAGES)

    @model_validator(mode="after")
    def validate_conversation(self):
        if any(not message.content.strip() for message in self.messages):
            raise ValueError("Messages must contain nonempty text.")
        if sum(len(message.content) for message in self.messages) > MAX_TOTAL_CHARS:
            raise ValueError("Conversation exceeds 12,000 characters.")
        if self.messages[-1].role != "user":
            raise ValueError("The final message must be from the user.")
        return self


def configuration() -> tuple[str, str]:
    return os.getenv("GROQ_API_KEY", "").strip(), os.getenv("GROQ_MODEL", "").strip()


@app.get("/api/health")
def health():
    key, model = configuration()
    return {"status": "ok", "configured": bool(key and model)}


@app.post("/api/chat")
async def chat(request: ChatRequest):
    key, model = configuration()
    if not key or not model:
        raise HTTPException(503, "Set GROQ_API_KEY and GROQ_MODEL to enable chat.")

    messages = [{"role": "system", "content": INSTRUCTION}]
    messages.extend(message.model_dump() for message in request.messages)

    try:
        async with AsyncGroq(api_key=key, timeout=20.0, max_retries=0) as client:
            completion = await client.chat.completions.create(
                model=model, messages=messages, max_completion_tokens=512
            )
    except (AuthenticationError, PermissionDeniedError):
        raise HTTPException(502, "Groq authentication or access failed. Check your key and model access.") from None
    except NotFoundError:
        raise HTTPException(502, "Groq model is unavailable. Check GROQ_MODEL.") from None
    except RateLimitError:
        raise HTTPException(429, "Groq rate limit reached. Please try again later.") from None
    except APITimeoutError:
        raise HTTPException(504, "Groq did not respond in time. Please try again.") from None
    except APIConnectionError:
        raise HTTPException(503, "Cannot connect to Groq. Check your connection.") from None
    except APIStatusError:
        raise HTTPException(502, "Groq could not complete this request. Check the model configuration.") from None

    reply = completion.choices[0].message.content if completion.choices else None
    if not isinstance(reply, str) or not reply.strip():
        raise HTTPException(502, "Groq returned an empty response. Please try again.")
    return {"reply": reply, "model": model}
