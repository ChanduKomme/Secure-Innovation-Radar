from __future__ import annotations

import os
from functools import lru_cache
from typing import Literal

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer

MODEL_NAME = os.getenv(
    "SENTENCE_MODEL",
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
)
MIN_SIMILARITY = float(os.getenv("MIN_SIMILARITY", "0.20"))

THEME_NAMES: dict[str, str] = {
    "predictive-maintenance": "Predictive Maintenance & Tool Wear",
    "quality-inspection": "AI Quality Inspection",
    "energy-efficiency": "Energy Efficiency",
    "process-automation": "Process Automation",
    "data-dashboards": "Data & Dashboarding",
    "knowledge-sharing": "Internal Knowledge Sharing",
    "safety-ergonomics": "Safety & Ergonomics",
    "documentation-workflow": "Documentation & Workflow",
}


class SuggestionIn(BaseModel):
    id: str
    title: str
    description: str = ""
    theme: str
    department: str | None = None
    impact: str | None = None


class AnalyzeRequest(BaseModel):
    query: str = Field(min_length=3, max_length=4000)
    suggestions: list[SuggestionIn] = Field(min_length=1, max_length=500)
    limit: int = Field(default=6, ge=1, le=20)


class RelatedResult(BaseModel):
    suggestion_id: str
    score: float


class AnalyzeResponse(BaseModel):
    engine: Literal["sentence-transformer"] = "sentence-transformer"
    model: str
    theme_id: str
    theme_name: str
    confidence: int
    related: list[RelatedResult]


app = FastAPI(
    title="Secure Innovation Radar Semantic API",
    version="1.0.0",
    description=(
        "Real multilingual semantic similarity and theme assignment for the "
        "Secure Innovation Radar synthetic-data prototype."
    ),
)

cors_env = os.getenv("SEMANTIC_CORS_ORIGINS", "*").strip()
allow_origins = ["*"] if cors_env == "*" else [x.strip() for x in cors_env.split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@lru_cache(maxsize=1)
def get_model() -> SentenceTransformer:
    # Lazy loading keeps the API process lightweight until the first real analysis.
    return SentenceTransformer(MODEL_NAME)


def _semantic_analysis(payload: AnalyzeRequest) -> AnalyzeResponse:
    if not payload.suggestions:
        raise HTTPException(status_code=400, detail="At least one suggestion is required")

    model = get_model()
    corpus = [f"{s.title}. {s.description}".strip() for s in payload.suggestions]
    embeddings = model.encode(
        [payload.query, *corpus],
        normalize_embeddings=True,
        convert_to_numpy=True,
        show_progress_bar=False,
    )

    query_embedding = embeddings[0]
    corpus_embeddings = embeddings[1:]
    scores = np.asarray(corpus_embeddings @ query_embedding, dtype=float)

    order = np.argsort(-scores)
    related: list[RelatedResult] = []
    for idx in order:
        score = float(np.clip(scores[idx], -1.0, 1.0))
        if score < MIN_SIMILARITY:
            continue
        related.append(
            RelatedResult(
                suggestion_id=payload.suggestions[int(idx)].id,
                score=round(score, 4),
            )
        )
        if len(related) >= payload.limit:
            break

    # Theme assignment is based on similarity-weighted evidence from the whole corpus,
    # not a hard-coded query rule. Squaring positive similarity gives the strongest
    # semantic neighbors more influence while still allowing multiple suggestions to vote.
    theme_scores: dict[str, float] = {}
    for suggestion, raw_score in zip(payload.suggestions, scores, strict=True):
        score = max(0.0, float(raw_score))
        if score <= 0:
            continue
        theme_scores[suggestion.theme] = theme_scores.get(suggestion.theme, 0.0) + score**2

    if not theme_scores:
        theme_id = payload.suggestions[int(order[0])].theme
        confidence = 50
    else:
        theme_id, winning_score = max(theme_scores.items(), key=lambda item: item[1])
        total = sum(theme_scores.values()) or 1.0
        share = winning_score / total
        top_similarity = max(0.0, float(scores[int(order[0])]))
        # Blend cluster agreement with nearest-neighbor strength into an interpretable
        # confidence indicator. This is not a calibrated probability.
        confidence = int(round(100 * min(0.99, 0.60 * share + 0.40 * top_similarity)))
        confidence = max(40, confidence)

    return AnalyzeResponse(
        model=MODEL_NAME,
        theme_id=theme_id,
        theme_name=THEME_NAMES.get(theme_id, theme_id.replace("-", " ").title()),
        confidence=confidence,
        related=related,
    )


@app.get("/health")
def health() -> dict[str, str | bool]:
    return {
        "status": "ok",
        "engine": "sentence-transformer",
        "model": MODEL_NAME,
        "synthetic_data_only": True,
    }


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    return _semantic_analysis(payload)


@app.post("/similar", response_model=AnalyzeResponse)
def similar(payload: AnalyzeRequest) -> AnalyzeResponse:
    # Alias kept for clarity in future API integrations.
    return _semantic_analysis(payload)
