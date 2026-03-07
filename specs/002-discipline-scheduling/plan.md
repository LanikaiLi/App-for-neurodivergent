# Implementation Plan: Discipline Scheduling

**Branch**: `002-discipline-scheduling` | **Date**: 2026-03-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-discipline-scheduling/spec.md`

## Summary

Add recurrence (Daily / Weekly / Custom) and preferred time (HH:MM or Anytime) to disciplines; persist schedule in localStorage; filter Today by recurrence and group by time-of-day slots (Early Morning, Morning, Noon, Afternoon, Evening, Night, Anytime) with collapsible sections. Reuse Google Calendar–style recurrence UX (dropdown + Custom sub-dialog). Manage tab: dedicated Schedule button per card opening a small modal. All within existing vanilla HTML/CSS/JS SPA and constitution constraints.

## Technical Context

**Language/Version**: JavaScript (ES5-style, no build); HTML5; CSS3  
**Primary Dependencies**: None (Google Fonts Nunito only)  
**Storage**: localStorage — extend `dd_disciplines` with schedule fields; no new keys  
**Testing**: Manual / in-browser; no test framework required by constitution  
**Target Platform**: Modern browsers, mobile-responsive (max-width 520px)  
**Project Type**: Single-page web application (SPA)  
**Performance Goals**: Today tab renders in &lt;1 s with 50+ disciplines (SC-006)  
**Constraints**: Vanilla only; no frameworks, no backend; data in localStorage  
**Scale/Scope**: Single user per device; dozens of disciplines; 7 time slots, 3 recurrence types + Custom

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Constraint | Status |
|------------------------|--------|
| I. Warm & Cozy Design | Pass — reuse existing palette, Nunito, gentle copy and transitions for new modals/dropdowns |
| II. No-Frills | Pass — recurrence and time are minimal; Custom sub-dialog only when needed |
| III. Game-Like Experience | Pass — existing checkbox/sound/sparkles/confetti unchanged; time slots only reorganize display |
| Stack: Vanilla HTML, CSS, JS only | Pass — no new frameworks or build |
| Storage: localStorage | Pass — extend existing `dd_disciplines` payload |
| Architecture: SPA, tab-based, one index.html | Pass — no routing; new UI is modals and in-page sections |
| Platform: mobile-responsive, 520px max | Pass — new UI follows existing layout patterns |
| Zero runtime dependencies | Pass — no new scripts |

## Project Structure

### Documentation (this feature)

```text
specs/002-discipline-scheduling/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1 (data shape + recurrence rules)
└── tasks.md             # Phase 2 (/speckit.tasks — not created by /speckit.plan)
```

### Source Code (repository root)

```text
index.html    # Add schedule modal(s), recurrence dropdown, time inputs, Today time-slot markup
app.js        # Schedule CRUD, recurrence logic, time-slot grouping, migration for existing disciplines
style.css     # Styles for time-slot sections, recurrence dropdown, Custom sub-dialog, Schedule button
```

**Structure Decision**: Single-page app; no new top-level dirs. All changes in existing `index.html`, `app.js`, `style.css`. New spec docs under `specs/002-discipline-scheduling/`.

## Complexity Tracking

No constitution violations. Table left empty.
