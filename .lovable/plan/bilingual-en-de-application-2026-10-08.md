# Bilingual EN / DE application

## Scope
- Add a compact EN / DE control in the existing top bar, before Submit Idea.
- Keep English as the default and persist the selected language in localStorage.
- Translate the complete interface across Overview, Submit Idea, Similar Ideas, AI Themes and details, Innovation Radar, Trust & Privacy, About, shared navigation, statuses, tables, demo content, errors, and metadata.
- Preserve the current layout, visual tokens, data structures, semantic-analysis behavior, deterministic interview scenario, and every synthetic-data disclaimer.

## Implementation
1. Add a lightweight app-wide language provider with typed translation helpers and hydration-safe localStorage restoration.
2. Add professional German dictionaries for shared interface copy, data-backed themes/suggestions/proposals, and each page's unique content.
3. Route all visible labels and dynamic values through translation helpers without changing stored canonical English values used by filtering or semantic logic.
4. Update the document language when the selection changes and localize route metadata where runtime-safe.
5. Record the localization architecture rule in `AGENTS.md`.

## Verification
- Run the existing routing tests and inspect the automated preview build result.
- Exercise EN → DE → persisted DE → EN in the live preview.
- Visit and visually verify all requested routes at desktop and mobile widths, including a theme detail view.
- Confirm the Submit Idea deterministic analysis and Trust & Privacy examples still behave unchanged.

## Assumption
- User-entered text remains exactly as entered; only supplied interface and synthetic demonstration content is translated.
