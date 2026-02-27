# Quickstart: Expand Point Range

**Feature**: 001-expand-point-range
**Date**: 2026-02-25

## How to Test

Open `index.html` in a browser. No build step required.

## Test Scenarios

### 1. Create a discipline with high point value

1. Go to the **Manage** tab
2. Click **+ Add Discipline**
3. Type "Deep work session" as the name
4. Type `250` in the custom points input
5. Click **Add to My Disciplines**
6. **Verify**: Discipline appears in the Manage list showing ★ 250
7. Go to **Today** tab
8. **Verify**: Discipline card shows "★ 250" badge without layout issues
9. Check the discipline off
10. **Verify**: Floating "+250 ★" animation appears correctly

### 2. Test the new preset buttons

1. Go to the **Manage** tab
2. Click **+ Add Discipline**
3. **Verify**: Preset buttons show 5, 10, 25, 50, 100
4. Click the "100" preset
5. **Verify**: Custom input updates to 100, button appears selected
6. Click the "25" preset
7. **Verify**: Custom input updates to 25, "100" deselects, "25" selects

### 3. Test maximum boundary

1. In the Add Discipline modal, type `600` in the points input
2. Submit the form
3. **Verify**: The discipline is saved with 500 points (capped)

### 4. Test minimum boundary

1. In the Add Discipline modal, type `0` in the points input
2. Submit the form
3. **Verify**: The discipline is saved with 1 point (minimum)

### 5. Edit existing discipline to higher value

1. Go to the **Manage** tab
2. Find an existing discipline
3. Change its points input to `300`
4. Click away (blur the input)
5. **Verify**: Value saves as 300
6. Go to **Today** tab and **Points** tab
7. **Verify**: Updated value reflects everywhere

### 6. Verify existing data is unaffected

1. Before making any code changes, note the current disciplines and their point values
2. After making changes, reload the page
3. **Verify**: All existing disciplines retain their original point values
4. **Verify**: Points balance, chart, and journal are unchanged

### 7. Verify mobile layout

1. Open browser DevTools, toggle device toolbar (responsive mode)
2. Set width to 320px
3. Create a discipline with 500 points
4. Go to the Today tab
5. **Verify**: "★ 500" badge does not overflow or clip the card
