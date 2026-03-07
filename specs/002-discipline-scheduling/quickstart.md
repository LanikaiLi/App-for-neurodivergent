# Quickstart: 002 Discipline Scheduling

**Branch**: `002-discipline-scheduling` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Goal

Implement recurrence (Daily / Weekly / Custom) and preferred time (HH:MM or Anytime) for disciplines; show Today tab grouped by time-of-day slots with collapsible sections; add Schedule button and edit modal on Manage tab. No new dependencies; extend existing `index.html`, `app.js`, `style.css` and `dd_disciplines` in localStorage.

## Key artifacts

| Artifact | Purpose |
|----------|---------|
| [spec.md](./spec.md) | Requirements, acceptance scenarios, FRs |
| [plan.md](./plan.md) | Technical context, constitution check, structure |
| [research.md](./research.md) | Recurrence logic, time slots, migration, validation |
| [data-model.md](./data-model.md) | Schedule object, validation, time-slot ranges |
| [contracts/schedule-data.md](./contracts/schedule-data.md) | Data shape and recurrence rules contract |
| [tasks.md](./tasks.md) | Implementation tasks (from `/speckit.tasks`) |

## Implementation order (high level)

1. **Data & migration** — Extend discipline object with `schedule` in app.js; normalize on load (default daily + Anytime); persist when saving disciplines.
2. **Recurrence helper** — Implement `isScheduledForDate(schedule, dateKey)` for daily/weekly/custom day/custom week (see research.md and contracts).
3. **Time-slot helper** — Map `preferredTime` to slot id (see data-model.md); sort disciplines within slot by time, Anytime by creation order.
4. **Add flow** — In Add Discipline modal: add recurrence dropdown (Daily, Weekly, Custom…), Custom sub-dialog (Repeat every N day/week, Repeat on chips), time inputs (HH, MM) + Anytime; validate and save schedule.
5. **Today tab** — Replace flat checklist with time-slot sections (Anytime first, then Early Morning … Night); filter disciplines by `isScheduledForDate(..., getTodayKey())`; auto-collapse empty slots; expand/collapse on header click; keep progress ring and checkbox/sound/confetti behavior.
6. **Manage tab** — Add "Schedule" (or "Edit schedule") button per card; open modal with same recurrence + time UI, pre-filled; save updates discipline and re-render Today if visible.
7. **Styling** — Time-slot headers, collapsed/expanded state, recurrence dropdown and Custom sub-dialog, Schedule button; keep warm/cozy palette and Nunito.

## Conventions

- **Date keys**: `YYYY-MM-DD` (same as existing `getTodayKey()`).
- **Weekday**: 0 = Sunday, 6 = Saturday (JavaScript `getDay()`).
- **Time**: 24h string `"HH:MM"`; store and compare as string or minutes-from-midnight for slot math.
- **Validation**: Gentle, encouraging messages; block save on invalid recurrence or time (FR-006, research §4).

## Running / testing

- Open `index.html` in a modern browser (no build). Use localStorage as-is.
- Manually: add discipline with recurrence and time; switch days (e.g. change device date or mock `getTodayKey`) to verify filtering; edit schedule from Manage and confirm Today updates.
- No automated test suite required by constitution; optional manual checklist from spec acceptance scenarios.
