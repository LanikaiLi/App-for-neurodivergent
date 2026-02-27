# Research: Expand Point Range

**Feature**: 001-expand-point-range
**Date**: 2026-02-25

## Research Summary

This feature has no unknowns or external dependencies requiring
research. All changes are to validation ranges and preset values
in existing code.

## Decision: New Maximum Value

- **Decision**: 500
- **Rationale**: Explicitly requested by the user. Provides 10x
  the current range, allowing meaningful differentiation between
  easy habits (1–10) and challenging habits (100–500).
- **Alternatives considered**: 100 (too small to differentiate
  well), 999 (arbitrary, 4-digit display issues), 1000 (round
  but may inflate point economy). 500 is the sweet spot.

## Decision: New Preset Values

- **Decision**: 5, 10, 25, 50, 100
- **Rationale**: Presets should be logarithmically spaced to cover
  the range meaningfully. Current presets (2, 5, 10, 15, 20) are
  linearly clustered at the low end. The new set provides quick
  access to easy (5–10), medium (25), hard (50), and very hard
  (100) disciplines. Users can still type any custom value.
- **Alternatives considered**:
  - Keep original presets (2, 5, 10, 15, 20) — too clustered at
    the low end for a 1–500 range
  - Full spread (5, 25, 100, 250, 500) — jumps too aggressively;
    most users will want values under 100
  - Six presets (5, 10, 25, 50, 100, 250) — adds clutter to the
    modal for marginal utility

## Decision: Default Value

- **Decision**: Keep 5 as the default
- **Rationale**: Current default, represents a "medium-easy" habit.
  Changing the default would confuse returning users.
- **Alternatives considered**: 10 (reasonable but breaks existing
  muscle memory), 1 (too low, feels unrewarding by default)

## Decision: Badge Layout

- **Decision**: Test existing CSS first; only adjust if overflow
  occurs
- **Rationale**: The `.points-badge` uses `white-space: nowrap`
  and the card is flexbox. "★ 500" is only one character wider
  than "★ 50". Likely no CSS change needed, but must verify on
  320px and 520px widths.
