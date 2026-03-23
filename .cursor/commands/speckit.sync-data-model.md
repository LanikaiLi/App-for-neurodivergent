---
description: Sync the current feature's data model changes into the app-wide ERD document.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Maintain a single, authoritative, app-wide data model document (ERD) at `.specify/memory/app-data-model.md`. When a feature adds, modifies, or removes fields from the persisted data model (localStorage keys and their shapes), this command merges those changes into the global ERD so there is always one up-to-date source of truth.

## Execution steps

1. **Resolve feature context**: Run `.specify/scripts/bash/check-prerequisites.sh --json --paths-only` from repo root. Parse `FEATURE_DIR`, `FEATURE_SPEC`, and `BRANCH`. If it fails, instruct user to check they are on a feature branch.

2. **Load inputs** (read all three):
   - The feature's `data-model.md` at `FEATURE_DIR/data-model.md`. If missing, check for data model info in the feature spec's Key Entities section or contracts directory.
   - The global ERD at `.specify/memory/app-data-model.md`. If the global ERD file does not exist, create it from scratch using all known data.
   - The feature spec at `FEATURE_SPEC` (for context on what changed and why).

3. **Diff and merge** — compare the feature's data model against the global ERD:

   a. **New entities or storage keys**: If the feature introduces a new localStorage key or a new top-level entity, add a new section in the global ERD following the existing format (table of fields, types, required, description).

   b. **New fields on existing entities**: If the feature adds fields to an existing entity (e.g. `schedule` on `dd_disciplines`), add those fields to the entity's table in the global ERD. If the field is a nested object, add a sub-table (like Schedule under Discipline).

   c. **Modified fields**: If the feature changes a field's type, validation range, or semantics (e.g. points range 1–50 → 1–500), update the field's row in the global ERD to reflect the new state. Do NOT keep the old value — the ERD always shows the current state.

   d. **Removed fields**: If the feature removes a field, remove it from the global ERD.

   e. **Relationships**: If new relationships between entities are introduced, update the "Relationships diagram (text)" section.

   f. **DBML block**: Update the `## DBML (for dbdiagram.io)` section to reflect the current state. The DBML must be written in the **plain DBML format** that dbdiagram.io recognizes. Follow these rules strictly:

      - **Table format**: Use `Table table_name { ... }` with columns listed as `column_name type [settings]`.
      - **Primary keys**: Use `[primary key]` (NOT `[pk]`).
      - **Column settings**: Only use settings dbdiagram supports: `primary key`, `not null`, `default: value`, `note: 'text'`, `unique`, `increment`.
      - **Do NOT use**: `headercolor`, `Project` blocks, or `[note: ...]` on `Ref` lines — dbdiagram does not recognize these.
      - **Relationships**: Use `Ref: table1.column > table2.column` (many-to-one), `Ref: table1.column - table2.column` (one-to-one), or `Ref: table1.column < table2.column` (one-to-many). No `[note: ...]` after the Ref.
      - **Comments**: Use `//` for inline comments.
      - **Nested objects**: Model nested JSON objects as separate tables with a 1:1 Ref back to the parent table (e.g. `dd_disciplines_schedule` linked to `dd_disciplines`).
      - **Example** of correct format:
        ```
        Table users {
          id integer [primary key]
          username varchar
          role varchar
          created_at timestamp
        }

        Table posts {
          id integer [primary key]
          title varchar
          body text [note: 'Content of the post']
          user_id integer [not null]
        }

        Ref: posts.user_id > users.id
        ```
      - The user must be able to copy-paste the entire DBML code block into dbdiagram.io and get a valid ERD with no errors.

   g. **Change log**: Append a row to the "Change log" table at the bottom:
      `| YYYY-MM-DD | <branch-name> | <brief description of data model changes> |`

4. **Update metadata**: Set "Last synced" at the top of the ERD to today's date and the current feature branch name.

5. **Validate**:
   - Every localStorage key mentioned in the constitution's Cross-Cutting section is documented in the ERD.
   - Every field in every entity has: Field name, Type, Required (yes/no/conditional), Description.
   - No duplicate field names within the same entity table.
   - Change log has one entry per sync (no duplicates for the same feature).
   - Markdown tables are well-formed.

6. **Write** the updated ERD back to `.specify/memory/app-data-model.md`.

7. **Report**:
   - List what was added, modified, or removed.
   - Show the updated change log entry.
   - Confirm the ERD path.

## Rules

- The ERD always reflects the **current** state of the data model, not the history. History is tracked only in the change log table.
- Do NOT remove sections for localStorage keys that still exist, even if the current feature doesn't touch them.
- If no data model changes are detected (feature doesn't touch persisted data), report: "No data model changes detected for this feature. ERD is up to date." and exit.
- If the global ERD file doesn't exist, create it from scratch by scanning:
  - The constitution's Cross-Cutting section for localStorage keys.
  - All existing `specs/*/data-model.md` files for field details.
  - The source code (`app.js`) for any fields not documented in specs.
- Keep the ERD format consistent with what's already there (tables, headings, text diagram).
- Preserve any manual additions the user may have made to the ERD (e.g. extra notes or sections) — only update the sections that correspond to changed entities.
