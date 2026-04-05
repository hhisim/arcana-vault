from __future__ import annotations

import logging
import time
import os
from typing import Any

import requests

from app.config import config
from app.models import AskResponse
from app.prompts import build_system_prompt
from app.retrieval import RetrievalError, retriever

logger = logging.getLogger(__name__)

MINIMAX_BASE_URL = "https://api.minimax.io/v1"
MINIMAX_MODEL = "MiniMax-M2.7"


class Synthesizer:
    def ask(
        self,
        query: str,
        pack: str,
        mode: str,
        target_lang: str = "en",
    ) -> AskResponse:
        sources: list[Any] = []
        context_parts: list[str] = []

        # Retrieval
        try:
            sources = retriever.query(pack=pack, query_text=query, k=5)
        except RetrievalError as exc:
            logger.warning("Retrieval unavailable: %s", exc)
        except Exception:
            logger.exception("Unexpected retrieval failure")

        for item in sources:
            if item.text:
                context_parts.append(f"Source: {item.source}\nText: {item.text}")

        system_prompt = build_system_prompt(pack=pack, mode=mode, target_lang=target_lang)
        user_prompt = (
            query
            if not context_parts
            else f"Context:\n\n{'\n\n---\n\n'.join(context_parts)}\n\nQuestion: {query}"
        )

        api_key = os.getenv("MINIMAX_API_KEY")
        if not api_key:
            raise RuntimeError("MINIMAX_API_KEY not configured")

        payload = {
            "model": MINIMAX_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.6,
            "max_tokens": 900,
        }
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        last_exc: Exception | None = None
        for attempt in range(3):
            try:
                response = requests.post(
                    f"{MINIMAX_BASE_URL}/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=120,
                )
                response.raise_for_status()
                data: dict[str, Any] = response.json()
                content = data["choices"][0]["message"]["content"].strip()

                # Handle <think> tags: keep answer after last </think>
                if "</think>" in content:
                    content = content.split("</think>")[-1].strip()

                if not content:
                    raise RuntimeError(f"Empty response: {data}")

                if mode == "scholar" and sources:
                    content += "\n\nSources:\n" + "\n".join(
                        f"- {s.source}" for s in sources
                    )

                return AskResponse(
                    answer=content,
                    sources=sources,
                    pack=pack,
                    mode=mode,
                )

            except Exception as exc:
                last_exc = exc
                logger.warning("Synthesis attempt %s failed: %s", attempt + 1, exc)
                if attempt < 2:
                    time.sleep(2 ** attempt)

        raise RuntimeError(f"Synthesis failed after retries: {last_exc}")


synthesizer = Synthesizer()
