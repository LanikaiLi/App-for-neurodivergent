# Data Model: Discipline Scheduling (002)

**Branch**: `002-discipline-scheduling` | **Spec**: [spec.md](./spec.md)

## Storage key

- **Key**: `dd_disciplines` (existing). No new localStorage key.
- **Format**: JSON array of discipline objects. Each object may include a `schedule` property.

## Discipline (extended)

Existing fields (unchanged):

| Field      | Type    | Description                    |
|-----------|---------|--------------------------------|
| `id`      | string  | Unique id                      |
| `name`    | string  | Display name                   |
| `points`  | number  | 1–500                          |
| `active`  | boolean | Shown on Today when true       |
| `createdAt` | string | Date key YYYY-MM-DD (existing) |

New/optional field:

| Field      | Type   | Description |
|------------|--------|-------------|
| `schedule` | object | Optional. When missing, treat as `{ recurrence: 'daily', preferredTime: null }`. See Schedule below. |

## Schedule (object on Discipline)

| Field           | Type   | Required | Description |
|-----------------|--------|----------|-------------|
| `recurrence`    | string | yes      | `"daily"` \| `"weekly"` \| `"custom"` |
| `weekdays`      | number[] | when weekly/custom week | 0–6 (Sun–Sat). At least one when recurrence is weekly or custom with unit week. |
| `interval`      | number | when custom | N ≥ 1. "Repeat every N days" or "every N weeks". Cap 365 (day), 52 (week). |
| `unit`          | string | when custom | `"day"` \| `"week"` |
| `referenceDate` | string | when custom | YYYY-MM-DD. Default to discipline `createdAt`. |
| `preferredTime` | string \| null | yes | `"HH:MM"` (24h) or `null` for Anytime. |

### Validation

- `recurrence`: only the three values above.
- `weekdays`: 0–6, no duplicates; length ≥ 1 when recurrence is `weekly` or (`custom` and unit `week`).
- `interval`: integer 1–365 (unit day), 1–52 (unit week).
- `preferredTime`: if present, match `/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/` or be null.

### State transitions

- **Create discipline**: Set `schedule: { recurrence: 'daily', preferredTime: null }` if not provided.
- **Load (migration)**: If `schedule` is missing or invalid, overwrite with `{ recurrence: 'daily', preferredTime: null }`.
- **Edit schedule**: User changes recurrence and/or time in modal; replace `schedule` on save.

## Time Slot (display only; not stored)

Used to group disciplines on the Today tab. Defined by label and minute range from midnight:

| Slot          | Start (min) | End (min) |
|---------------|-------------|-----------|
| Anytime       | —           | —         |
| Early Morning | 420 (07:00) | 540 (09:00) |
| Morning       | 540         | 720 (12:00) |
| Noon          | 720         | 780 (13:00) |
| Afternoon     | 780         | 1020 (17:00) |
| Evening       | 1020        | 1140 (19:00) |
| Night         | 1140        | 1320 (22:00) |

A discipline with `preferredTime === null` or with minutes &lt; 420 or ≥ 1320 goes to Anytime.

## Records and other keys

- `dd_records`, `dd_rewards`, `dd_exchange`: unchanged. Completion and points logic unchanged; Today filtering uses schedule + current date only.
