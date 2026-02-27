# Tasks: Expand Point Range

**Input**: Design documents from `specs/001-expand-point-range/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No setup needed — existing project structure is unchanged. No new files, no new dependencies.

- [ ] T001 Verify current branch is 001-expand-point-range and working directory is clean

---

## Phase 2: User Story 1 — Assign High Point Values (Priority: P1) MVP

**Goal**: Users can create new disciplines with point values up to 500.

**Independent Test**: Create a new discipline with 250 points. Verify it appears on the Today tab with "★ 250" badge and awards 250 points when checked.

- [ ] T002 [P] [US1] Change max attribute from "50" to "500" on the custom points input (#addPoints) in index.html
- [ ] T003 [P] [US1] Change validation cap from 50 to 500 in the add form submit handler in app.js (around line 486-487: `if (pts > 50) pts = 50` → `if (pts > 500) pts = 500`)
- [ ] T004 [US1] Manually test: open Add Discipline modal, type 250, submit. Verify discipline saves with 250 points and displays correctly on Today tab

**Checkpoint**: Users can now create disciplines with values 1–500. MVP complete.

---

## Phase 3: User Story 2 — Edit Existing Disciplines to Higher Values (Priority: P2)

**Goal**: Users can edit existing discipline point values beyond 50 on the Manage tab.

**Independent Test**: Go to Manage tab, change an existing discipline's points to 150, verify it updates everywhere.

- [ ] T005 [P] [US2] Change max attribute from "50" to "500" in the renderManage() function's generated HTML string in app.js (around line 377: `max="50"` → `max="500"`)
- [ ] T006 [P] [US2] Change validation cap from 50 to 500 in the manage tab points change handler in app.js (around line 406-407: `if (val > 50) val = 50` → `if (val > 500) val = 500`)
- [ ] T007 [US2] Manually test: go to Manage tab, edit a discipline's points to 300, verify value persists and shows correctly on Today tab and Points tab

**Checkpoint**: Users can now both create and edit disciplines with values 1–500.

---

## Phase 4: User Story 3 — Updated Preset Buttons (Priority: P3)

**Goal**: Preset buttons in the Add Discipline modal span the expanded 1–500 range.

**Independent Test**: Open Add Discipline modal, verify presets show 5, 10, 25, 50, 100. Tap each and confirm the input updates.

- [ ] T008 [US3] Change preset button data-pts values from "2, 5, 10, 15, 20" to "5, 10, 25, 50, 100" in index.html (lines 73-77)
- [ ] T009 [US3] Update the default preset selection in the modal open handler in app.js (around line 446) to highlight "5" as the default preset matching the default value of 5
- [ ] T010 [US3] Manually test: open Add Discipline modal, verify presets show 5/10/25/50/100, tap each one, confirm input updates and button highlights correctly

**Checkpoint**: All three user stories complete.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verify no layout issues across all tabs with larger point values.

- [ ] T011 Verify points badge ("★ 500") does not overflow discipline cards on Today tab at 320px and 520px widths in style.css — adjust badge padding/min-width only if overflow occurs
- [ ] T012 Verify Points tab balance card, chart, and exchange rate render correctly with point totals in the hundreds
- [ ] T013 Verify Analysis tab per-discipline rate bars display correctly for disciplines with high point values
- [ ] T014 Run full quickstart.md test scenarios (7 scenarios) to confirm end-to-end behavior

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (US1)**: Depends on Phase 1
- **Phase 3 (US2)**: Can run in parallel with Phase 2 (different code locations)
- **Phase 4 (US3)**: Can run in parallel with Phase 2 and 3 (different code locations)
- **Phase 5 (Polish)**: Depends on all user stories being complete

### Within Each User Story

- HTML attribute changes and JS validation changes can run in parallel [P]
- Manual testing must happen after both HTML and JS changes

### Parallel Opportunities

- T002 and T003 can run in parallel (different files: index.html vs app.js)
- T005 and T006 can run in parallel (different functions in app.js)
- Phases 2, 3, and 4 can all run in parallel (independent code locations)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001 (verify branch)
2. Complete T002 + T003 in parallel (HTML max + JS validation)
3. Complete T004 (test)
4. **STOP and VALIDATE**: Can create disciplines with 250+ points

### Incremental Delivery

1. Phase 2 (US1) → Test → MVP done
2. Phase 3 (US2) → Test → Edit works
3. Phase 4 (US3) → Test → Presets updated
4. Phase 5 → Full validation → Feature complete
