<!--
  SYNC IMPACT REPORT
  ==================
  Version change: 0.0.0 (template) → 1.0.0 (initial ratification)

  Added principles:
    - I. Warm & Cozy Design
    - II. No-Frills
    - III. Game-Like Experience

  Added sections:
    - Technical Constraints
    - Current Feature Set (mid-project adoption inventory)
    - Governance

  Removed sections:
    - Template placeholders for Principles 4 and 5 (user specified 3)

  Templates checked:
    ✅ .specify/templates/plan-template.md — no changes needed
    ✅ .specify/templates/spec-template.md — no changes needed
    ✅ .specify/templates/tasks-template.md — no changes needed
    ✅ .specify/templates/checklist-template.md — no changes needed
    ✅ .specify/templates/agent-file-template.md — no changes needed

  Follow-up TODOs: None
-->

# Daily Disciplines Constitution

## Purpose

Daily Disciplines is a tool built for neurodivergent people to
support their daily life. It serves autistic and highly sensitive
(HSP) individuals whose brains operate like precision instruments
that benefit from structured tuning.

**Why it is needed**:

- HSP people are sensitive to stimuli and need reliable routines
  (e.g., placing earplugs within reach every night). This tool
  helps form those protective habits.
- HSP people are often harder on themselves than others. The point
  system relieves guilt when taking a break or buying something
  they want.
- HSP people often prioritize others over themselves, sometimes
  inviting harm. Daily disciplines serve as mental reminders to
  break negative loops and refocus on self-care.

## Core Principles

### I. Warm & Cozy Design

This tool MUST provide mental peace to its users, who need to be
treated gently and with love.

- All visual design MUST use the established warm palette (terra
  cotta, golden, sage green) with soft shadows and rounded corners.
- Typography MUST use Nunito or a similarly warm, rounded typeface.
- Interactions MUST feel gentle — no harsh transitions, no jarring
  colors, no aggressive animations.
- Empty states and error messages MUST use encouraging, supportive
  language.
- The overall aesthetic MUST evoke comfort, not productivity-tool
  sterility.

### II. No-Frills

This tool MUST be simple and easy to use, without complicated
features.

- Every new feature MUST be justifiable in one sentence that
  connects to the user's daily self-care.
- UI MUST avoid clutter — if a screen feels busy, it has too much.
- No feature SHOULD require a tutorial or explanation beyond a
  short hint label.
- Settings and configuration MUST be minimal and have sensible
  defaults.
- When in doubt, leave it out (YAGNI).

### III. Game-Like Experience

This tool MUST provide a game-like experience that motivates users
to form good habits and feel rewarded for self-care.

- Completing disciplines MUST trigger satisfying feedback (sound
  effects, visual particles, animations).
- Achieving 100% daily completion MUST trigger a celebration
  (confetti, victory sound).
- The point system MUST make earning and spending feel tangible
  and fun.
- Progress visualization (streaks, heatmaps, charts) MUST
  reinforce a sense of growth, never shame.
- Negative framing MUST be avoided — no "you failed" states, only
  "keep going" encouragement.

## Technical Constraints

- **Stack**: Vanilla HTML, CSS, and JavaScript only. No frameworks,
  no build tools, no bundlers, no transpilers. Files are served
  directly.
- **Storage**: All user data MUST persist in the browser's
  localStorage. No backend, no database, no cloud sync.
- **Architecture**: Single-page application with tab-based
  navigation inside one `index.html`. No routing library.
- **Platform**: MUST be mobile-responsive with a max-width of
  520px. MUST work in all modern browsers.
- **Dependencies**: Zero runtime dependencies. Google Fonts
  (Nunito) is the only external resource.

## Current Feature Set

Since spec-driven development is being adopted mid-project, this
section documents the existing capabilities. New features MUST NOT
duplicate or conflict with what is listed here.

### Today Tab

- Daily checklist of active disciplines
- Progress ring showing completion ratio
- Checkbox toggle with sound effects (Web Audio API), sparkle
  particles, floating point indicators
- Confetti celebration on 100% daily completion

### Manage Tab

- Add/delete disciplines via modal
- Toggle disciplines active/inactive
- Configurable point values per discipline (1–50)

### Points Tab

- Points balance card with earned/spent breakdown
- Configurable exchange rate (points to real-world currency)
- Cumulative points line chart (canvas-rendered)
- "Treat Yourself" reward spending with optional photo upload
- Treats journal with delete/refund capability

### Analysis Tab

- Day streak, average completion %, perfect days stats
- Time range filter (7 days, 30 days, all time)
- Per-discipline completion rate bars
- Daily completion heatmap with tooltips

### Cross-Cutting

- All data persisted in localStorage (4 keys: `dd_disciplines`,
  `dd_records`, `dd_rewards`, `dd_exchange`)
- Tab-based SPA navigation
- Warm/cozy theme with Nunito font
- Mobile-responsive (520px max-width)

## Governance

- This constitution supersedes all other development practices for
  the Daily Disciplines project.
- Every new feature specification MUST be checked against the Core
  Principles and Technical Constraints before implementation.
- Amendments to this constitution MUST be documented with version
  bump, rationale, and date.
- Versioning follows semantic versioning: MAJOR for principle
  removals or redefinitions, MINOR for new principles or sections,
  PATCH for clarifications and wording fixes.

**Version**: 1.0.0 | **Ratified**: 2026-02-25 | **Last Amended**: 2026-02-25
