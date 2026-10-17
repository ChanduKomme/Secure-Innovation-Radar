# Secure Innovation Radar

A privacy-aware AI prototype for employee suggestion intelligence: semantic similarity, recurring-theme discovery, trend prioritization, generative-AI hypotheses, and trustworthy processing of internal ideas.

> Independent prototype using synthetic data only. Not affiliated with or commissioned by GFE.

## Why this project exists

The prototype explores how an organization can move beyond a traditional suggestion box. Instead of reviewing isolated text entries one by one, the system groups conceptually similar ideas, highlights recurring organizational problems, and turns them into decision-ready themes for expert review.

The interface was prototyped with Lovable, while the semantic layer uses a real multilingual embedding model. The public demo can run the model directly in the browser, so semantic similarity is calculated from embeddings instead of fixed demonstration percentages. An optional Python/FastAPI backend is also included for a server-side deployment.

## Main capabilities

- Employee problem / solution submission with anonymous mode
- Privacy screening and basic prompt-injection detection
- Real multilingual sentence embeddings
- Cosine-similarity search for related suggestions
- Similarity-weighted recurring-theme assignment  
- English/German semantic matching
- AI theme intelligence and improvement hypotheses
- Innovation radar for frequency vs. estimated business impact
- Human-review workflow and trustworthy-AI controls
- Synthetic industrial/business demo data only

## Default architecture — self-contained public demo

```text
Employee Suggestion
        |
        v
Privacy & Prompt-Safety Screening
        |
        v
Browser ONNX Embedding Engine
Transformers.js + multilingual MiniLM
        |
        +--> Cosine Similarity --> Related Suggestions
        |
        +--> Similarity-Weighted Theme Assignment
        |
        v
React / TypeScript Innovation Dashboard
```

The default public application uses `@huggingface/transformers` and a quantized ONNX version of:

```text
Xenova/paraphrase-multilingual-MiniLM-L12-v2
```

The first semantic analysis can take longer because the model is downloaded and cached by the browser. Subsequent analyses are faster.

## Optional server-side architecture

For a controlled server deployment, the same frontend can use the FastAPI service in `backend/`:

```text
React Frontend
      |
      v
FastAPI
      |
      v
sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
      |
      +--> normalized embeddings
      +--> cosine similarity
      +--> theme assignment
```

Set `VITE_SEMANTIC_API_URL` to switch from the browser model to the remote semantic API.

## Frontend development

Requirements: Node.js 22+ and npm.

```bash
git clone https://github.com/ChanduKomme/Secure-Innovation-Radar.git
cd Secure-Innovation-Radar
npm install
npm run dev
```

No semantic backend is required for the default mode. The browser downloads the embedding model on first use.

If the real model cannot load, the UI falls back to a deterministic demonstration implementation and labels that state rather than presenting demo values as live AI output.

## Optional FastAPI semantic backend

Python 3.10+ is recommended.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Check it with:

```bash
curl http://localhost:8000/health
```

Then create a root `.env` file:

```text
VITE_SEMANTIC_API_URL=http://localhost:8000
```

Restart the frontend after changing the environment variable.

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

The API returns the detected theme, an interpretable confidence indicator, and related suggestion IDs with model-generated cosine-similarity scores.

> The confidence indicator is not presented as a calibrated probability. It combines nearest-neighbor semantic strength with agreement among similarity-weighted theme evidence.

## Multilingual demo

Try semantically equivalent English and German inputs:

```text
Detect cutting-tool wear using acoustic signals.
Werkzeugverschleiß anhand akustischer Signale frühzeitig erkennen.
```

The multilingual embedding model is intended to place conceptually equivalent suggestions near each other even when they are written in different languages.

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

Browser semantic engine: Transformers.js, ONNX, multilingual MiniLM embeddings

Optional backend: Python, FastAPI, SentenceTransformers, NumPy


