# Research: Discipline Scheduling (002)

**Branch**: `002-discipline-scheduling` | **Spec**: [spec.md](./spec.md)

## 1. Recurrence: "Is this discipline due today?"

**Decision**: Implement a pure function `isScheduledForDate(schedule, dateKey)` (or equivalent) that returns true iff the discipline should appear on the given calendar day.

- **daily**: Always true for any date.
- **weekly**: True iff the weekday of `dateKey` is in `schedule.weekdays` (0–6, Sunday–Saturday). Require at least one weekday selected; otherwise treat as "never" or block save with gentle validation.
- **custom** (unit **day**): True iff `(daysSince(schedule.referenceDate, dateKey) % schedule.interval) === 0`, with reference date = discipline `createdAt` (or explicit `schedule.referenceDate`). Interval N ≥ 1; cap N at 365 for sanity.
- **custom** (unit **week**): True iff (a) weekday of `dateKey` is in `schedule.weekdays`, and (b) `(weeksSince(schedule.referenceDate, dateKey) % schedule.interval) === 0`. Require at least one weekday. Interval N ≥ 1; cap N at 52.

**Rationale**: Matches spec and Calendar-style semantics; no server; easy to test with fixed dates.

**Alternatives considered**: RRULE library — rejected (dependency and overkill for three patterns).

---

## 2. Time-slot assignment (grouping)

**Decision**: Define fixed slots as closed-open intervals in minutes from midnight; map a preferred time (HH:MM or null) to a slot id.

- Early Morning: 07:00–09:00 (420–540 min)
- Morning: 09:00–12:00 (540–720 min)
- Noon: 12:00–13:00 (720–780 min)
- Afternoon: 13:00–17:00 (780–1020 min)
- Evening: 17:00–19:00 (1020–1140 min)
- Night: 19:00–22:00 (1140–1320 min)
- Anytime: `preferredTime === null` or outside 07:00–22:00 (e.g. 06:00, 23:00 → Anytime)

Boundary rule: time T belongs to the slot whose start ≤ T &lt; end. E.g. 09:00 → Morning; 12:00 → Noon.

**Rationale**: Spec defines exact ranges; integer minutes avoid float issues; boundaries unambiguous.

**Alternatives considered**: Configurable slots — deferred (YAGNI).

---

## 3. Migration of existing disciplines

**Decision**: On first load after deploy (or when reading `dd_disciplines`), normalize each discipline: if `schedule` is missing or invalid, set `schedule: { recurrence: 'daily', preferredTime: null }`. No separate migration script; migration is inline when loading disciplines.

**Rationale**: FR-009 and spec: pre-existing disciplines default to Daily and Anytime so nothing disappears.

**Alternatives considered**: Second key for schedule — rejected to keep one source of truth per discipline.

---

## 4. Validation rules (Custom recurrence and time)

**Decision**:
- **Custom interval N**: Require N ≥ 1 (integer). Cap: 365 for "day", 52 for "week". Show gentle message on invalid or out-of-range.
- **Weekly / Custom week**: Require at least one weekday selected before save; otherwise show gentle validation (e.g. "Pick at least one day").
- **Time**: HH 0–23, MM 0–59; reject non-numeric. Already in spec (FR-004–FR-006).

**Rationale**: Prevents "never appears" (zero weekdays) and absurd intervals; aligns with spec edge cases.

---

## 5. UI placement: recurrence and time in "New Discipline" modal

**Decision**: Add recurrence and time **inside the existing Add Discipline modal** (same form as name and points): one section for recurrence (dropdown + Custom sub-dialog when needed), one for time (HH, MM, Anytime). No wizard steps. Edit flow: Manage card → "Schedule" button → small modal with same recurrence + time UI, pre-filled.

**Rationale**: Spec says "scheduling section in the modal" and "same … UI as when creating"; constitution favors minimal UI. Single modal keeps flow simple.

**Alternatives considered**: Multi-step wizard — rejected (no-frills).
