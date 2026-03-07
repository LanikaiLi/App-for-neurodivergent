# Feature Specification: Discipline Scheduling

**Feature Branch**: `002-discipline-scheduling`  
**Created**: 2026-03-07  
**Status**: Draft  
**Input**: User description: "Add discipline scheduling with weekday selection, structured time input, smart grouping algorithm, and an organized Today tab displaying disciplines grouped by time-of-day slots."

## Clarifications

### Session 2026-03-07

- Q: When "Every N days" is selected, should weekday selection be disabled or hidden? A: Adopt Google Calendar–style recurrence UX. Recurrence is presented as a dropdown (Does not repeat / Daily / Weekly / Custom…). Choosing "Custom…" opens a sub-dialog with "Repeat every [N] [day|week]", "Repeat on" day-of-week chips when unit is week, and Ends: Never. This separates "weekly on specific days" from "every N days" by unit. Only the schedule/recurrence part of the Calendar pattern is used; the app does not become a full calendar. Weekly on fixed weekdays is the recommended pattern when the user wants the same weekdays (e.g. every Monday and Wednesday) to avoid drift that "every N days" can cause across different calendar years.
- Q: What should "Does not repeat" mean for when a discipline appears on the Today tab? A: Do not offer "Does not repeat". New disciplines default to "Daily". This is a habit/discipline product — habits and disciplines are recurring by nature, not one-off; users who want specific days use Weekly or Custom.
- Q: On the Manage tab, how does the user open the schedule editor for a discipline? A: Each discipline card has a dedicated button (e.g. "Schedule" or "Edit schedule"); clicking it opens a small window (modal) like Google Calendar, with the same recurrence and time UI as when creating.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Schedule a Discipline with Recurrence (Priority: P1)

A user creates or edits a discipline and sets when it repeats, using a recurrence pattern inspired by Google Calendar (schedule/recurrence only; the app does not become a full calendar). Recurrence is presented as a dropdown: "Daily", "Weekly", or "Custom…" (no "Does not repeat" — habits/disciplines are recurring by nature). New disciplines default to "Daily". Choosing "Custom…" opens a sub-dialog with "Repeat every [N] [day | week]" and, when unit is "week", "Repeat on" day-of-week chips (M T W T F S S). "Ends" defaults to Never. The Today tab shows only disciplines scheduled for the current day. For fixed weekdays (e.g. every Monday and Wednesday), "Weekly" or Custom with unit "week" + selected days is recommended over "every N days", because "every N days" drifts across calendar years (e.g. can end up Tuesday/Thursday instead of Monday/Wednesday).

**Why this priority**: This is the foundational scheduling capability. Without recurrence and day filtering, time input and time slot display have nothing to organize. It directly solves the core problem: not all disciplines belong on every day.

**Independent Test**: Can be fully tested by creating disciplines with different recurrence rules and verifying that only the correct ones appear on any given day. Delivers immediate value by decluttering the Today view.

**Acceptance Scenarios**:

1. **Given** a user is adding or editing a discipline, **When** they reach the scheduling section in the modal, **Then** they see a recurrence dropdown (default "Daily") that can be opened to show options: Daily, Weekly, Custom….
2. **Given** a user selects "Weekly", **When** the UI updates, **Then** they see day-of-week chips (e.g. M T W T F S S) to select which weekdays the discipline repeats on.
3. **Given** a user selects "Custom…", **When** the sub-dialog opens, **Then** they see "Repeat every [N] [day | week]" and, when unit is "week", "Repeat on" with day chips; Ends is Never for this feature.
4. **Given** a user sets Custom "Repeat every 1 week" and selects Monday, Wednesday, Friday, **When** they view the Today tab on a Tuesday, **Then** that discipline does not appear.
5. **Given** a user sets Custom "Repeat every 1 week" and selects Monday, Wednesday, Friday, **When** they view the Today tab on a Wednesday, **Then** that discipline appears in the checklist.
6. **Given** a user selects "Daily", **When** they view the Today tab on any day, **Then** that discipline always appears.
7. **Given** a user sets Custom "Repeat every 3 days" (unit = day), **When** they view the Today tab, **Then** the discipline appears on days that are 0, 3, 6, … days after the reference date (e.g. createdAt).
8. **Given** a user has existing disciplines without any schedule, **When** the feature is deployed, **Then** those disciplines default to "Daily" so nothing disappears unexpectedly.

---

### User Story 2 - Set a Preferred Time for a Discipline (Priority: P1)

A user assigns a preferred time to a discipline using a structured `[HH]:[MM]` input. The two fields (hours and minutes) are separate numeric-only inputs, preventing ambiguous free-text entry like "12.15". Users can also choose "Anytime" to indicate the discipline has no specific time — it just needs to happen at some point during the day.

**Why this priority**: Time input is the other half of scheduling. Together with weekday selection, it enables the smart grouping and time slot display that give this feature its organizational power.

**Independent Test**: Can be fully tested by assigning times to disciplines and verifying the values persist, display correctly, and reject invalid entries. The "Anytime" option can be tested by leaving time unset and confirming the discipline still appears.

**Acceptance Scenarios**:

1. **Given** a user is scheduling a discipline, **When** they reach the time input, **Then** they see two separate numeric input boxes labeled HH and MM, plus an "Anytime" toggle.
2. **Given** a user enters "07" in the HH box and "30" in the MM box, **When** they save, **Then** the discipline stores a preferred time of 07:30.
3. **Given** a user tries to type letters or special characters into the HH or MM boxes, **When** they type, **Then** the input is rejected (only digits 0–9 are accepted).
4. **Given** a user enters an hour value greater than 23 or a minute value greater than 59, **When** they attempt to save, **Then** the system shows a gentle validation message and does not save the invalid time.
5. **Given** a user toggles "Anytime" on, **When** they save, **Then** no specific time is stored and the discipline appears in a flexible/anytime section on the Today tab.
6. **Given** a user has not set any time (new or migrated discipline), **When** the discipline displays, **Then** it defaults to "Anytime".

---

### User Story 3 - View Today Tab Organized by Time Slots (Priority: P1)

When a user opens the Today tab, they see today's date and weekday prominently displayed at the top. Below that, instead of a flat list of all disciplines, they see collapsible time-of-day sections: Early Morning (7–9 AM), Morning (9 AM–12 PM), Noon (12–1 PM), Afternoon (1–5 PM), Evening (5–7 PM), and Night (7–10 PM). An additional "Anytime" section holds disciplines with no specific time. Each section is a dropdown that expands to show the disciplines scheduled within that time range.

**Why this priority**: This is the primary display redesign that brings all the scheduling data together into an organized, calming view. It's the user-facing payoff of Stories 1 and 2.

**Independent Test**: Can be fully tested by creating disciplines at various times and verifying they appear in the correct time slot section. Empty sections should be auto-collapsed. Expanding/collapsing sections should work smoothly.

**Acceptance Scenarios**:

1. **Given** the user opens the Today tab, **When** the tab renders, **Then** today's full date and weekday name are displayed prominently at the top (e.g., "Saturday, March 7, 2026").
2. **Given** the user has disciplines scheduled for today, **When** the Today tab renders, **Then** disciplines are grouped into the correct time slot sections based on their preferred time.
3. **Given** a discipline has a preferred time of 08:00, **When** the Today tab renders, **Then** it appears under the "Early Morning (7–9 AM)" section.
4. **Given** a discipline has no preferred time (Anytime), **When** the Today tab renders, **Then** it appears under the "Anytime" section.
5. **Given** a time slot has no disciplines scheduled for today, **When** the Today tab renders, **Then** that time slot section is automatically collapsed and visually subdued.
6. **Given** a time slot section is collapsed, **When** the user taps/clicks the section header, **Then** it smoothly expands to reveal the disciplines inside.
7. **Given** a time slot section is expanded and contains disciplines, **When** the user taps/clicks the section header again, **Then** it smoothly collapses.
8. **Given** sections with disciplines exist, **When** the Today tab renders, **Then** those sections are expanded by default so the user immediately sees what they need to do.

---

### User Story 4 - Smart Grouping of Disciplines (Priority: P2)

The system uses a grouping algorithm behind the scenes to organize disciplines intelligently. Disciplines scheduled for the same day are grouped together. Within a day, disciplines with close start times are placed into the same time-of-day slot. This grouping powers the time slot display on the Today tab and ensures that the visual organization feels natural and logical.

**Why this priority**: This is the algorithmic backbone that makes the Today tab display work smoothly. It's lower priority because the time slot boundaries are fixed (not dynamic), making the grouping logic straightforward — but it still needs to handle edge cases like disciplines right on slot boundaries.

**Independent Test**: Can be tested by creating disciplines with times at slot boundaries (e.g., 8:59 AM, 9:00 AM, 12:00 PM) and verifying correct slot assignment. Also testable by checking that the same-day filter works correctly across different weekday configurations.

**Acceptance Scenarios**:

1. **Given** a discipline is set to 8:59 AM, **When** grouping occurs, **Then** it is placed in "Early Morning (7–9 AM)".
2. **Given** a discipline is set to 9:00 AM, **When** grouping occurs, **Then** it is placed in "Morning (9 AM–12 PM)".
3. **Given** a discipline is set to 12:00 PM, **When** grouping occurs, **Then** it is placed in "Noon (12–1 PM)".
4. **Given** a discipline is set to a time outside all defined slots (e.g., 6:00 AM or 11:00 PM), **When** grouping occurs, **Then** it is placed in the "Anytime" section as a fallback.
5. **Given** multiple disciplines share the same time slot, **When** the Today tab renders, **Then** they are displayed together within that slot, sorted by their specific time (earliest first).

---

### User Story 5 - Edit Scheduling for Existing Disciplines (Priority: P2)

A user can modify the recurrence and preferred time of an existing discipline from the Manage tab. Each discipline card has a dedicated button (e.g. "Schedule" or "Edit schedule"); clicking it opens a small modal window (like Google Calendar) with the same recurrence dropdown and time selection UI as when creating, pre-populated with current values. Changes take effect immediately on the Today tab.

**Why this priority**: Essential for ongoing use but not needed for the initial experience of creating scheduled disciplines.

**Independent Test**: Can be tested by creating a discipline, clicking the schedule button on its card, changing recurrence or time in the modal, saving, and verifying the Today tab updates accordingly.

**Acceptance Scenarios**:

1. **Given** a user views an existing discipline on the Manage tab, **When** they click the dedicated schedule/edit-schedule button on that card, **Then** a small modal opens with the same recurrence dropdown and time selection UI as when creating, pre-populated with current values.
2. **Given** a user changes a discipline from "Daily" to "Weekly" with only Monday selected, **When** they save and view the Today tab on a Wednesday, **Then** that discipline no longer appears.
3. **Given** a user changes a discipline's time from 8:00 AM to 2:00 PM, **When** they view the Today tab, **Then** the discipline moves from "Early Morning" to "Afternoon".

---

### Edge Cases

- What happens when a user sets "Repeat every 0" days/weeks or a negative interval in Custom recurrence? The system must treat intervals less than 1 as invalid and show a gentle validation message.
- What happens when a discipline's preferred time falls exactly on a slot boundary (e.g., 9:00 AM)? It belongs to the slot that starts at that time (Morning, not Early Morning).
- What happens when the user's device clock is in a different timezone? The system uses the device's local date and time, consistent with the current `getTodayKey()` behavior.
- What happens when all disciplines for a day are "Anytime"? The time slot sections are all collapsed and only the "Anytime" section is visible and expanded.
- What happens when a discipline is toggled inactive on the Manage tab? It does not appear in any time slot on the Today tab, regardless of its schedule.
- What happens when a discipline's time is set to a time outside all defined slots (before 7 AM or after 10 PM)? It falls into the "Anytime" section.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present recurrence as a dropdown with options: Daily, Weekly, Custom… (no "Does not repeat"; habits/disciplines are recurring by nature). Default for new disciplines is Daily. Google Calendar–style for schedule/recurrence only; the app is not a full calendar.
- **FR-002**: System MUST allow users to select one or more weekdays (e.g. via M T W T F S S chips) when recurrence is "Weekly" or Custom with unit "week".
- **FR-003**: System MUST provide a "Custom…" recurrence that opens a sub-dialog with "Repeat every [N] [day | week]"; when unit is "week", show "Repeat on" day-of-week chips; "Ends" defaults to Never. When unit is "day", the discipline repeats every N days from a reference date (e.g. createdAt).
- **FR-004**: System MUST provide a structured time input with two separate numeric-only fields: one for hours (00–23) and one for minutes (00–59).
- **FR-005**: System MUST NOT allow non-numeric characters in the time input fields.
- **FR-006**: System MUST validate that hours are 0–23 and minutes are 0–59 before saving.
- **FR-007**: System MUST provide an "Anytime" option that indicates a discipline has no specific preferred time.
- **FR-008**: System MUST default new disciplines to "Daily" schedule and "Anytime" time preference.
- **FR-009**: System MUST default all pre-existing disciplines (created before this feature) to "Daily" and "Anytime" so they continue to appear every day.
- **FR-010**: System MUST filter the Today tab to show only disciplines scheduled for the current day according to their recurrence rule (Daily, Weekly on selected days, or Custom every N days / every N weeks on selected days).
- **FR-011**: System MUST display today's full date and weekday name at the top of the Today tab.
- **FR-012**: System MUST group Today tab disciplines into time-of-day sections: Early Morning (7–9 AM), Morning (9 AM–12 PM), Noon (12–1 PM), Afternoon (1–5 PM), Evening (5–7 PM), Night (7–10 PM), and Anytime.
- **FR-013**: System MUST auto-collapse time slot sections that contain no disciplines for the current day.
- **FR-014**: System MUST auto-expand time slot sections that contain at least one discipline for the current day.
- **FR-015**: System MUST allow users to manually expand or collapse any time slot section by tapping/clicking the section header.
- **FR-016**: System MUST place disciplines with times outside the defined slot ranges (before 7 AM or after 10 PM) into the "Anytime" section.
- **FR-017**: System MUST sort disciplines within a time slot by their preferred time (earliest first), with "Anytime" disciplines appearing in creation order.
- **FR-018**: System MUST persist scheduling data (weekdays, time, recurrence) in localStorage alongside existing discipline data.
- **FR-019**: System MUST show a dedicated button (e.g. "Schedule" or "Edit schedule") on each discipline card on the Manage tab; clicking it opens a small modal with the same recurrence and time UI as the create flow, pre-populated with that discipline's current schedule. Changes apply immediately and reflect on the Today tab.
- **FR-020**: System MUST continue to support all existing discipline features (points, active/inactive toggle, checkbox completion, sound effects, sparkles, confetti) within the new time slot layout.

### Key Entities

- **Schedule**: Represents when a discipline should appear. Recurrence follows a Calendar-style model: type ("daily" | "weekly" | "custom"); there is no "none" / one-off — habits are recurring. For "weekly", store selected weekdays (0–6) and interval (default 1 week); for "custom" with unit "day", store interval N and reference date; for "custom" with unit "week", store interval N, selected weekdays, and end condition (Never for this feature). Preferred time: HH:MM string or null for Anytime.
- **Time Slot**: A named period of the day used for display grouping — defined by a label, start time, and end time. The seven slots are fixed: Early Morning, Morning, Noon, Afternoon, Evening, Night, and Anytime.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can assign a weekday schedule and preferred time to a discipline in under 30 seconds.
- **SC-002**: The Today tab correctly shows only disciplines scheduled for the current day — zero disciplines appear on days they are not scheduled for.
- **SC-003**: All disciplines appear in the correct time-of-day section based on their preferred time, with 100% accuracy at slot boundaries.
- **SC-004**: Empty time slot sections are collapsed by default, reducing visual clutter on days with few scheduled disciplines.
- **SC-005**: Pre-existing disciplines continue to appear daily after the update with no user action required (backward compatibility).
- **SC-006**: The organized Today tab loads and renders within 1 second, even with 50+ disciplines.
- **SC-007**: Users can expand or collapse any time slot section in a single tap/click with a smooth transition.

## Assumptions

- The app adopts only the **schedule/recurrence** part of the Google Calendar pattern (dropdown + Custom sub-dialog with repeat interval and repeat-on days). It does not become a full calendar (no month view, no events list by date, no guests/location/video).
- "Weekly on fixed weekdays" (e.g. every Monday and Wednesday) is the recommended pattern when the user wants the same weekdays each week; "every N days" is supported in Custom for flexibility but can drift across calendar years (e.g. end up on different weekdays).
- Custom "Repeat every N days" uses the discipline's `createdAt` (or another reference date) as the anchor; the discipline appears on days 0, N, 2N, … from that date.
- The 24-hour clock format (00–23) is used for the time input; the display in time slot headers uses 12-hour format with AM/PM for readability.
- The progress ring on the Today tab will continue to reflect completion of all disciplines scheduled for today (not all disciplines globally).
- Inactive disciplines (toggled off on the Manage tab) are excluded from the Today tab regardless of their schedule.
- The "Anytime" section appears at the top of the Today tab (before the timed slots) since flexible disciplines can be done whenever the user has a moment, and placing them first gives gentle encouragement to knock out quick wins early.
