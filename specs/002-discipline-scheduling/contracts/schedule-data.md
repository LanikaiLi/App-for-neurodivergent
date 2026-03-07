# Contract: Schedule data shape and recurrence rules

**Feature**: 002-discipline-scheduling | **Consumers**: app.js (load/save, Today filter, time-slot grouping)

## Discipline schedule payload (in localStorage `dd_disciplines`)

Each discipline object may include:

```json
{
  "id": "...",
  "name": "...",
  "points": 5,
  "active": true,
  "createdAt": "2026-03-07",
  "schedule": {
    "recurrence": "daily" | "weekly" | "custom",
    "weekdays": [0,1,2,3,4,5,6],
    "interval": 1,
    "unit": "day" | "week",
    "referenceDate": "2026-03-07",
    "preferredTime": "08:30" | null
  }
}
```

- **recurrence** required. **weekdays** required when recurrence is `weekly` or when recurrence is `custom` and **unit** is `week`; must have at least one element (0–6).
- **interval**, **unit**, **referenceDate** required when recurrence is `custom`. **interval** 1–365 (unit day), 1–52 (unit week).
- **preferredTime** required; string `"HH:MM"` (24h) or `null` (Anytime).

## Recurrence rule: "Is discipline due on date D?"

- **daily**: true for any D.
- **weekly**: true iff `dayOfWeek(D)` is in `schedule.weekdays` (0 = Sunday, 6 = Saturday).
- **custom** (unit **day**): true iff `(daysBetween(schedule.referenceDate, D) % schedule.interval) === 0` (integer division; day 0 = reference date).
- **custom** (unit **week**): true iff (a) `dayOfWeek(D)` is in `schedule.weekdays`, and (b) `(weeksBetween(schedule.referenceDate, D) % schedule.interval) === 0`.

## Time-slot assignment

Given `preferredTime` (string or null):

- `null` or outside 07:00–21:59 → **Anytime**.
- 07:00–08:59 → Early Morning; 09:00–11:59 → Morning; 12:00–12:59 → Noon; 13:00–16:59 → Afternoon; 17:00–18:59 → Evening; 19:00–21:59 → Night.

Boundaries: start of range inclusive, end exclusive (e.g. 09:00 → Morning).
