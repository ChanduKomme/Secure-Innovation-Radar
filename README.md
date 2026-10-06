# Secure Innovation Radar

A privacy-aware AI prototype for employee suggestion intelligence: semantic similarity, recurring-theme discovery, trend prioritization, generative-AI hypotheses, and trustworthy processing of internal ideas.

> Independent prototype using synthetic data only. Not affiliated with or commissioned by GFE.

## Why this project exists

The prototype explores how an organization can move beyond a traditional suggestion box. Instead of reviewing isolated text entries one by one, the system groups conceptually similar ideas, highlights recurring organizational problems, and turns them into decision-ready themes for expert review.

The UI was prototyped with Lovable. The semantic layer is implemented separately in Python/FastAPI so the similarity and theme assignment can be produced by a real multilingual embedding model rather than hard-coded demonstration values.

## Main capabilities

- Employee problem / solution submission with anonymous mode
- Privacy screening and basic prompt-injection detection
- Multilingual sentence embeddings
- Cosine-similarity search for related suggestions
- Similarity-weighted recurring-theme assignment
- AI theme intelligence and improvement hypotheses
- Innovation radar for frequency vs. estimated business impact
- Human-review workflow and trustworthy-AI controls
- Synthetic industrial/business demo data only

## Architecture

```text
Employee Suggestion
        |
        v
Privacy & Prompt-Safety Screening
        |
        v
FastAPI Semantic Service
        |
        v
Multilingual SentenceTransformer
        |
        +--> Cosine Similarity --> Related Suggestions
        |
        +--> Similarity-Weighted Theme Assignment
        |
        v
React / TypeScript Innovation Dashboard
```

## Frontend development

Requirements: Node.js and npm.

```bash
git clone https://github.com/ChanduKomme/Secure-Innovation-Radar.git
cd Secure-Innovation-Radar
npm install
npm run dev
```

The app continues to work in deterministic demo-fallback mode when no semantic API is configured.

## Live semantic backend

The backend lives in `backend/` and uses FastAPI plus a multilingual SentenceTransformer.

Default model:

```text
sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
```

This supports a useful interview demo where semantically equivalent English and German ideas can be matched into the same theme.

### Start the backend

Python 3.10+ is recommended.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Check:

```bash
curl http://localhost:8000/health
```

The first semantic request may take longer because the embedding model is downloaded and loaded once.

### Connect the frontend

Create a local `.env` in the repository root:

```bash
VITE_SEMANTIC_API_URL=http://localhost:8000
```

Then restart the frontend:

```bash
npm run dev
```

When configured, the Similar Ideas page displays live embedding-based scores and the Submit Idea workflow uses the backend for semantic theme assignment. If the service is unreachable, the frontend falls back safely to the existing deterministic demo logic and labels that state clearly.

## API

### `GET /health`

Returns the semantic-engine status and configured embedding model.

### `POST /analyze`

Example request:

```json
{
  "query": "Use acoustic signals to identify cutting-tool wear before quality decreases.",
  "limit": 3,
  "suggestions": [
    {
      "id": "SUG-1001",
      "title": "Predict cutting-tool degradation from acoustic signals",
      "description": "Train a model on acoustic recordings to estimate remaining tool life.",
      "theme": "predictive-maintenance",
      "department": "Production",
      "impact": "High"
    }
  ]
}
```

The API returns the detected theme, an interpretable confidence indicator, and related suggestion IDs with live cosine-similarity scores.

> The confidence indicator is not presented as a calibrated probability. It combines nearest-neighbor semantic strength with agreement among similarity-weighted theme evidence.

## Privacy and security positioning

The prototype deliberately keeps privacy/security separate from semantic similarity:

1. Employee text is treated as untrusted input.
2. PII-like data can be sanitized before semantic processing.
3. Prompt-injection-like content is flagged rather than treated as trusted system instructions.
4. AI-generated recommendations remain advisory and require human validation.

A production implementation would require stronger NER/DLP controls, authentication, authorization, audit storage, model governance, rate limiting, input-size controls, and formal evaluation.

## Synthetic data disclaimer

All employee suggestions shown in the prototype are synthetic. Public-research alignment examples are illustrative only. No confidential or internal GFE information is used.

## Built with

Frontend: React, TypeScript, TanStack Router, Tailwind/shadcn-style components

Semantic backend: Python, FastAPI, SentenceTransformers, NumPy

UI prototyping: Lovable
