# Implementation Plan: Expand Point Range

**Branch**: `001-expand-point-range` | **Date**: 2026-02-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-expand-point-range/spec.md`

## Summary

Expand the discipline point value range from 1–50 to 1–500 across
all input surfaces (Add Discipline modal, Manage tab inline edit)
and update preset buttons to span the new range. All existing data
and display surfaces must handle larger values without layout issues.

## Technical Context

**Language/Version**: JavaScript (ES5+), HTML5, CSS3
**Primary Dependencies**: None (vanilla stack)
**Storage**: localStorage (`dd_disciplines` key)
**Testing**: Manual browser testing
**Target Platform**: Modern browsers, mobile-responsive (520px max)
**Project Type**: Single-page web application
**Performance Goals**: N/A (no computation changes)
**Constraints**: Offline-capable, zero dependencies
**Scale/Scope**: 3 source files (index.html, app.js, style.css)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Warm & Cozy Design | PASS | No visual design changes except accommodating wider numbers in badges. Warm palette and gentle interactions preserved. |
| II. No-Frills | PASS | Feature is justifiable in one sentence: "Let users assign point values that match the true difficulty of their self-care habits." No new UI complexity — same inputs, wider range. |
| III. Game-Like Experience | PASS | Expanding the range makes the point system more meaningful and fun — harder habits get bigger rewards, which feels more game-like. |
| Technical: Vanilla stack | PASS | All changes are in existing HTML/JS/CSS files. No new dependencies. |
| Technical: localStorage | PASS | No schema changes. Existing `dd_disciplines` data is forward-compatible (values 1–50 are valid in 1–500). |
| Technical: Mobile-responsive | CHECK | Points badge on Today tab needs to accommodate 3-digit numbers (e.g., "★ 500") without overflow on 520px screens. |

**Gate result**: PASS — no violations. One item to verify in implementation (badge width on mobile).

## Project Structure

### Documentation (this feature)

```text
specs/001-expand-point-range/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
index.html          # HTML structure, input constraints, preset buttons
app.js              # Validation logic, default values
style.css           # Points badge sizing (if adjustment needed)
```

**Structure Decision**: Flat single-page app with no directory structure.
All source lives at the repository root. Three files total.

## Change Locations

### index.html

1. **Add Discipline modal — preset buttons** (line ~73-77):
   Change `data-pts` values from `2, 5, 10, 15, 20` to `5, 10, 25, 50, 100`

2. **Add Discipline modal — custom points input** (line ~80):
   Change `max="50"` to `max="500"`

3. **Manage tab — inline points input** (line ~377 in rendered HTML via app.js):
   This is generated dynamically in `renderManage()` — change happens in app.js

### app.js

4. **Add form submit handler** (around line 486-487):
   Change `if (pts > 50) pts = 50;` to `if (pts > 500) pts = 500;`

5. **Manage tab points change handler** (around line 406-407):
   Change `if (val > 50) val = 50;` to `if (val > 500) val = 500;`

6. **renderManage() — inline points input** (around line 377):
   Change `max="50"` to `max="500"` in the generated HTML string

7. **Add modal open handler** (around line 446):
   Update preset default selection logic if preset values change

### style.css

8. **Points badge** (around line 295-304):
   May need minor width adjustment to accommodate "★ 500" without truncation.
   Test first — current flex layout may already handle it.

## Complexity Tracking

No constitution violations. No complexity tracking needed.
