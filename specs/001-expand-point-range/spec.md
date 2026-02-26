# Feature Specification: Expand Point Range

**Feature Branch**: `001-expand-point-range`
**Created**: 2026-02-25
**Status**: Draft
**Input**: User description: "Make the disciplines on manage tab more flexible, right now the points are maximum 50 value, but I want to increase that to 500, with lowest point be 1."

## User Scenarios & Testing

### User Story 1 - Assign High Point Values to Hard Disciplines (Priority: P1)

A user has a discipline that requires significant effort — for example, "Complete a 2-hour deep work session" or "Go for a 5K run." The current maximum of 50 points does not let them differentiate this from easier habits like "Drink a glass of water." The user wants to assign a high point value (e.g., 200 or 500) to make the reward feel proportional to the effort.

**Why this priority**: This is the core request. Without expanding the range, the feature has no value.

**Independent Test**: Can be fully tested by creating a new discipline and assigning a point value above 50 (e.g., 250). The discipline appears correctly on the Today tab with the assigned value, and completing it awards the full points.

**Acceptance Scenarios**:

1. **Given** a user is adding a new discipline, **When** they set the point value to 250, **Then** the system accepts it and saves the discipline with 250 points.
2. **Given** a user is adding a new discipline, **When** they set the point value to 500, **Then** the system accepts it (maximum allowed).
3. **Given** a user is adding a new discipline, **When** they set the point value to 501 or higher, **Then** the system caps it at 500.
4. **Given** a user is adding a new discipline, **When** they set the point value to 0 or below, **Then** the system sets it to 1 (minimum allowed).

---

### User Story 2 - Edit Existing Discipline Points to Higher Values (Priority: P2)

A user already has disciplines created with points in the 1–50 range. They want to go to the Manage tab and increase the point value of an existing discipline beyond 50 — for example, changing a discipline from 10 points to 150 points.

**Why this priority**: Editing existing disciplines is essential for users who want to rebalance their point assignments without deleting and recreating them.

**Independent Test**: Can be tested by navigating to the Manage tab, editing the point value of an existing discipline to a value above 50, and confirming the new value persists and displays correctly everywhere (Manage tab, Today tab points badge, Points tab calculations).

**Acceptance Scenarios**:

1. **Given** a discipline exists with 10 points, **When** the user changes the value to 150 on the Manage tab, **Then** the discipline shows 150 points everywhere.
2. **Given** a discipline exists with 10 points, **When** the user changes the value to 500, **Then** the system accepts it (maximum allowed).
3. **Given** a discipline exists with 10 points, **When** the user changes the value to 600, **Then** the system caps it at 500.

---

### User Story 3 - Quick-Select from Updated Preset Values (Priority: P3)

When adding a new discipline, the user sees preset point buttons that let them quickly pick a common value without typing. The current presets (2, 5, 10, 15, 20) are too low for the expanded range. The presets should span the full 1–500 range so users can quickly tap a value that fits.

**Why this priority**: Presets are a convenience feature. The core functionality (typing a custom value) works without them, but updated presets significantly improve the experience for the new range.

**Independent Test**: Can be tested by opening the Add Discipline modal, tapping each preset button, and confirming the points input updates to the selected value.

**Acceptance Scenarios**:

1. **Given** a user opens the Add Discipline modal, **When** they see the preset buttons, **Then** the presets span a meaningful range across 1–500 (e.g., 5, 10, 25, 50, 100).
2. **Given** a user taps a preset button, **When** the preset is selected, **Then** the custom points input updates to match and the button appears selected.
3. **Given** a user types a custom value after selecting a preset, **When** the custom value does not match any preset, **Then** no preset button appears selected.

### Edge Cases

- What happens to existing disciplines that already have points between 1 and 50? They remain unchanged and valid since the new range (1–500) fully contains the old range (1–50).
- What happens if a user types a non-numeric value? The system falls back to the default value (5 points).
- What happens on the Points tab with much larger point totals? The balance card, chart, and exchange rate calculations continue to work correctly with larger numbers.
- What happens to the points badge on the Today tab for 3-digit values (e.g., "★ 500")? The badge accommodates the wider number without breaking the card layout.

## Requirements

### Functional Requirements

- **FR-001**: The system MUST accept point values between 1 and 500 (inclusive) when creating a new discipline.
- **FR-002**: The system MUST accept point values between 1 and 500 (inclusive) when editing an existing discipline on the Manage tab.
- **FR-003**: The system MUST cap any value above 500 to 500 and any value below 1 to 1.
- **FR-004**: The Add Discipline modal MUST display preset buttons that span the expanded range (e.g., 5, 10, 25, 50, 100).
- **FR-005**: The default point value for a new discipline MUST remain 5.
- **FR-006**: All existing point-related displays (Today tab badge, Points tab balance, Analysis tab) MUST render correctly with values up to 500.
- **FR-007**: Existing disciplines with point values in the 1–50 range MUST continue to work without any migration or data changes.

### Key Entities

- **Discipline**: Represents a daily habit. Has a `points` attribute that currently accepts 1–50 and will expand to 1–500. No structural changes to the entity — only the validation range changes.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can assign any point value between 1 and 500 when creating or editing a discipline.
- **SC-002**: The preset buttons in the Add Discipline modal cover a meaningful spread across the 1–500 range.
- **SC-003**: All existing disciplines and historical point data remain intact with no data loss after the change.
- **SC-004**: The Today tab, Points tab, and Analysis tab display correctly with point values up to 500 (no layout overflow, no truncated numbers).

## Assumptions

- The preset values (5, 10, 25, 50, 100) are a reasonable default spread. The user can adjust these later if desired.
- The default point value for new disciplines remains 5. This is the current default and represents a "medium-easy" discipline.
- No changes to the exchange rate system are needed — it already works with arbitrary point totals.
