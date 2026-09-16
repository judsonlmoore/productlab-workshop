# Design System

This file defines the visual foundation for the workshop project.

The tokens, typography scale, elevation levels, and signal system are mandatory.
Use them exactly as specified. They are the guardrails.

The view-level component sections (Table, Kanban, Card Grid, Forms) are reference
implementations. They show the intended visual quality and give you starting CSS.
Adapt them to fit your View Spec. Adjust padding, spacing, and layout to serve
the information hierarchy of your specific feature. Do not copy them blindly.

---

## External Resources

Add these lines to the `<head>` of `index.html` (only if not already present):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/iconoir-icons/iconoir@main/css/iconoir.css">
```

---

## Color Tokens

These are the only colors permitted. No other colors may be introduced.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#F6F6F6` | Page background, sidebar background |
| `--color-surface` | `#FDFDFD` | Main content area background |
| `--color-surface-white` | `#FFFFFF` | Cards, filter chips, active tabs |
| `--color-surface-muted` | `#F0F0F0` | Tab group backgrounds |
| `--color-border` | `#EFEFEF` | Dividers between sections and KPIs |
| `--color-border-medium` | `#E5E5E5` | Filter bar borders |
| `--color-border-strong` | `#D3D3D3` | Filter chip borders |
| `--color-text-primary` | `#1B1B1B` | All primary text, active labels |
| `--color-text-secondary` | `#666` | Secondary labels, breadcrumbs, icons |
| `--color-text-muted` | `#999` | Meta text, section labels, chart axes |
| `--color-signal-positive` | `#22C55E` | Positive delta values, good status indicators |
| `--color-signal-warning` | `#F59E0B` | Warning text and decision diamonds; never container backgrounds |
| `--color-signal-negative` | `#EF4444` | Negative delta values, warning status indicators |
| `--color-accent` | `#FF6B35` | Brand accent, logo icon — use sparingly |
| `--color-overlay` | `rgba(0,0,0,0.04)` | Hover state backgrounds |
| `--color-overlay-badge` | `rgba(0,0,0,0.05)` | Badge/pill backgrounds |

---

## Global Reset and Base

```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  background: #F6F6F6;
  color: #1B1B1B;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
```

---

## Typography Scale

Use the size/weight combinations below. The 14px/400 body reset is a base fallback; components use the roles below. Icon glyph sizes are governed by the Icons section, not this text scale.

| Role | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Page / hero heading | 18px | 600 | `#1B1B1B` | Main title of the view |
| Section heading | 15px | 600 | `#1B1B1B` | Chart title, table section heading |
| KPI value / metric number | 20px | 600 | `#1B1B1B` | Large data readouts |
| Navigation / body labels | 13px | 500–600 | `#1B1B1B` | Nav items, breadcrumb active state |
| Body / data values | 13px | 400 | `#666` | Subtitles, secondary body copy |
| Filter chips / small controls | 12px | 500–600 | `#1B1B1B` | Chips, tab buttons |
| Meta / section labels | 12px | 400–500 | `#666` | KPI labels with icon |
| Chart axis / legend text | 10–11px | 400–600 | `#999` | Axis labels, legend items |
| Micro badge text | 9px | 600 | `#999` | Beta badges, count pills |

---

## Shadows

Shadows communicate elevation. Higher surfaces cast more visible shadows.
All values are intentionally soft — this is a light, restrained UI, not a Material Design app.

### Elevation Scale

| Level | Surface type | `box-shadow` value |
|---|---|---|
| **0 — Flat** | Page background, sidebar, header, table rows | `none` |
| **1 — Card** | Content panels, grid cards, kanban columns | `0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)` |
| **2 — Raised** | Active tab in tab group, active filter chip, inline dropdowns | `0 2px 6px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)` |
| **3 — Floating** | Side drawers, detail panels that slide over content | `0 4px 16px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)` |
| **4 — Modal** | Dialogs, confirmation overlays | `0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.08)` |

**Backdrop overlay for Level 4:** `background: rgba(0,0,0,0.24)` behind the modal, covering the full viewport.

Rules:
- Do not apply shadow to data rows, table containers, or list panels. Structure is communicated by borders at Level 0.
- Level 1 replaces the need for heavy borders on cards. Do not combine Level 1 shadow with a visible border.
- Elevation levels are not decorative. Use the level that matches the actual surface relationship.


---

## Borders and Dividers

Borders communicate structure, not status. Use only the patterns below.

| Pattern | CSS | Use |
|---|---|---|
| Section divider | `1px solid #EFEFEF` | Between page sections (header/content, KPI row, legend) |
| Filter bar border (top and bottom) | `1px solid #E5E5E5` | Filter bar isolation |
| Filter chip border | `1px solid #D3D3D3` | Resting chip border |
| Filter chip border on hover | `1px solid #999` | Hover state for chips |
| Sidebar right edge | `1px solid #EFEFEF` | Sidebar/main separation |
| Chart gridline | `1px dashed #EFEFEF` | Horizontal grid lines in charts |
| Active nav indicator | `2px solid #1B1B1B`, left edge, 4px inset top/bottom, border-radius 1px | Active sidebar nav item |

**FORBIDDEN:** Do not use borders to communicate status, urgency, or errors on data items. Status is communicated by typography weight and indicator dots only.

---

## Status and Signal Indicators

Status is never communicated by borders on rows or cards. Use these patterns instead:

### Status Indicators

Status labels use neutral squares unless a semantic outcome is known: positive green for accepted, warning amber for unresolved questions, critical red for mismatches/overdue. In Discussion does not require a blue token.

Indicators are always inline with label text — same vertical rhythm, same line height.
Size is fixed at 8×8px. Shape encodes semantic meaning. Color encodes state.
Do not mix shapes arbitrarily. Choose based on what the indicator communicates.

#### Circle — Continuous state
Use for: live/active states, availability, pipeline health, online/offline.
The circle communicates something ongoing, not yet resolved.

```css
.indicator-circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
```

#### Square — Discrete category or count
Use for: stage labels, source tags, type badges, count pills.
The square communicates a bounded category — something that belongs to a named group.

```css
.indicator-square {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  display: inline-block;
  flex-shrink: 0;
}
```

#### Diamond — Priority or alert requiring a decision
Use for: priority levels (High / Medium / Low), escalated alerts, items needing action.
The diamond communicates directionality and urgency — something that points somewhere.
Achieved with a square rotated 45°. Use a wrapper to preserve text flow.

```css
/* Wrapper keeps the rotated element in flow */
.indicator-diamond-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
  flex-shrink: 0;
}
.indicator-diamond {
  width: 7px;
  height: 7px;
  border-radius: 1px;
  transform: rotate(45deg);
  display: block;
}
```

#### Color values (apply to all shapes)

| State | Color | Use |
|---|---|---|
| Positive / Healthy / Active | `#22C55E` | Good status, on-track, hired, completed |
| Negative / Critical / Overdue | `#EF4444` | Stuck, blocked, overdue, at-risk |
| Neutral / Inactive / Unknown | `#999` | No data, inactive, unset priority |
| High priority (diamond only) | `#EF4444` | High urgency items |
| Medium priority (diamond only) | `#F59E0B` | Medium urgency — amber signal |
| Low priority (diamond only) | `#999` | Low urgency — muted |


### Delta Value (trend)
A numeric label showing direction of change. No icon required.

```css
.delta-positive { color: #22C55E; font-size: 12px; font-weight: 500; }
.delta-negative { color: #EF4444; font-size: 12px; font-weight: 500; }
```

### Threshold / Alert Indicator
For any numeric value that has crossed a critical threshold — overdue items, counts above a limit,
values in a danger zone — highlight the value itself, not its container.

```css
/* Correct: highlight the value, not the container */
.value-critical { color: #EF4444; font-weight: 600; }

/* FORBIDDEN */
.row  { border-left: 2px solid red; }  /* never do this */
.card { background: #fff0f0; }          /* never do this */
```

The threshold that triggers `.value-critical` is defined in the Feature Brief's Data Contract
and passed through the dataset's `metadata`. Never hardcode threshold values in the UI.


### Badge / Pill
For categorical labels (stage, priority, source).

```css
.badge {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  background: rgba(0,0,0,0.05);
  border-radius: 4px;
  padding: 4px;
}
```

All badges use the same muted style. Color is NOT used to differentiate categories — that is the text's job.

---

## Interactive Controls

### Filter Chip (pill shape with chevron)

```css
.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #FFFFFF;
  border: 1px solid #D3D3D3;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: #1B1B1B;
  cursor: pointer;
  transition: border-color 0.15s;
  white-space: nowrap;
}
.filter-chip:hover { border-color: #999; }
.filter-chip .chip-chevron {
  font-size: 16px;
  color: #666;
  transition: transform 0.15s;
  margin-left: 4px;
}
.filter-chip.open .chip-chevron {
  transform: rotate(180deg);
}
```

### Tab Group (segmented control)

```css
.tab-group {
  display: flex;
  background: #F0F0F0;
  border-radius: 6px;
  padding: 4px;
  gap: 4px;
}
.tab-group button {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;
}
.tab-group button.active {
  background: #FFFFFF;
  font-weight: 600;
  color: #1B1B1B;
  box-shadow: 0 2px 6px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05); /* Elevation Level 2 */
}
```

### Nav Item (sidebar row)

```css
.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px;
  font-size: 13px;
  font-weight: 500;
  color: #1B1B1B;
  cursor: pointer;
  transition: background 0.1s;
  position: relative;
}
.nav-item:hover { background: rgba(0,0,0,0.04); }
.nav-item i { font-size: 20px; color: #666; width: 20px; height: 20px; }
.nav-item.active { font-weight: 600; }
.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background: #1B1B1B;
  border-radius: 1px;
}
```

---

## Spacing and Layout

Spacing follows a 4px base grid: `4, 8, 12, 16, 24, 32, 48`.
Use these values for padding, gaps, and margins. Border widths, icon/indicator geometry, and the explicit desktop shell dimensions are exempt.

### Reference values

| Context | Value |
|---|---|
| Page content horizontal padding | `24px` |
| Sidebar horizontal padding | `16px` |
| Section vertical padding | `16px` |
| Filter bar padding | `8px 24px` |
| KPI card padding | `12px 12px` |
| Header height | `55px` |
| Gap between filter chips | `8px` |
| Gap between nav icon and label | `8px` |
| Gap between legend items | `16px` |

### Component spacing rules

Buttons, inputs, and chips use 8px or 12px padding. Compact badges use 4px.
Rows and section containers may use asymmetric padding (for example 8px 24px)
to align content with the page grid. There is no universal padding ratio requirement.
Reference CSS may be adapted with these tokens to meet the View Spec.

---

## Icons

Use **Iconoir** icons only. Icon size is 16–17px for inline use, 20px for nav items, and 32px for an empty-state illustration.
Icon color follows text: `#1B1B1B` for primary context, `#666` for secondary, `#999` for muted.

Icons are always decorative in this design system. They support labels; they do not replace them.

---

## Table View

Use for structured data. No zebra striping. Structure through borders only.

```css
/* Table container */
.table-container {
  background: #FDFDFD;
}

/* Column headers */
.table-header {
  display: flex;
  align-items: center;
  padding: 8px 24px;
  border-bottom: 1px solid #EFEFEF;
  gap: 0;
}
.table-header-cell {
  font-size: 11px;
  font-weight: 500;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  flex: 1;
}

/* Data rows */
.table-row {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid #EFEFEF;
  cursor: pointer;
  transition: background 0.1s;
}
.table-row:hover { background: rgba(0,0,0,0.04); }

/* Cell values */
.table-cell {
  font-size: 13px;
  font-weight: 400;
  color: #1B1B1B;
  flex: 1;
}
.table-cell-secondary {
  font-size: 12px;
  font-weight: 400;
  color: #666;
}

/* Primary identifier (name, title) */
.table-cell-primary {
  font-size: 13px;
  font-weight: 500;
  color: #1B1B1B;
}
```

Status in tables: use `.value-critical` (color: #EF4444, font-weight: 600) on the value cell only. Never color the row.

---

## Kanban View

Columns are flat. Cards are white surfaces with subtle separation.

```css
/* Kanban layout */
.kanban-board {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  overflow-x: auto;
  align-items: flex-start;
}

/* Column */
.kanban-column {
  background: #F6F6F6;
  border-radius: 6px;
  padding: 8px;
  min-width: 200px;
  flex-shrink: 0;
}
.kanban-column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px 8px;
  font-size: 11px;
  font-weight: 500;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.kanban-column-count {
  font-size: 11px;
  font-weight: 600;
  color: #999;
  background: rgba(0,0,0,0.05);
  border-radius: 4px;
  padding: 4px;
}

/* Card */
.kanban-card {
  background: #FFFFFF;
  border: 1px solid #EFEFEF;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.kanban-card:hover { border-color: #D3D3D3; }

.kanban-card-title {
  font-size: 13px;
  font-weight: 500;
  color: #1B1B1B;
  margin-bottom: 4px;
}
.kanban-card-subtitle {
  font-size: 12px;
  font-weight: 400;
  color: #666;
}
.kanban-card-meta {
  font-size: 11px;
  font-weight: 400;
  color: #999;
  margin-top: 8px;
}
```

Threshold alerts in cards: use `.value-critical` (color: #EF4444, font-weight: 600) on the data value only. Do not change card border or background.

---

## Form Inputs

```css
/* Input and Select */
.form-input,
.form-select {
  font-family: inherit;
  font-size: 13px;
  font-weight: 400;
  color: #1B1B1B;
  background: #FFFFFF;
  border: 1px solid #D3D3D3;
  border-radius: 4px;
  padding: 8px 8px;
  width: 100%;
  outline: none;
  transition: border-color 0.15s;
  -webkit-appearance: none;
}
.form-input:focus,
.form-select:focus { border-color: #999; }
.form-input::placeholder { color: #999; }

/* Label */
.form-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
}

/* Form group */
.form-group {
  margin-bottom: 16px;
}

/* Submit / primary button */
.btn-primary {
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
  background: #1B1B1B;
  border: none;
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-primary:hover { opacity: 0.85; }

/* Secondary / ghost button */
.btn-secondary {
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: #1B1B1B;
  background: transparent;
  border: 1px solid #D3D3D3;
  border-radius: 4px;
  padding: 8px 8px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.btn-secondary:hover { border-color: #999; }
```

---

## Card Grid

For item collections where each item has equal visual weight.

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  padding: 16px 24px;
}

.grid-card {
  background: #FFFFFF;
  border: 1px solid #EFEFEF;
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.grid-card:hover { border-color: #D3D3D3; }

.grid-card-title {
  font-size: 13px;
  font-weight: 600;
  color: #1B1B1B;
  margin-bottom: 4px;
}
.grid-card-subtitle {
  font-size: 12px;
  font-weight: 400;
  color: #666;
  margin-bottom: 12px;
}
.grid-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #EFEFEF;
}
.grid-card-meta {
  font-size: 11px;
  font-weight: 400;
  color: #999;
}
```

---

## Empty State

For views with no data to display.

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}
.empty-state i {
  font-size: 32px;
  color: #D3D3D3;
  margin-bottom: 12px;
}
.empty-state-title {
  font-size: 15px;
  font-weight: 600;
  color: #1B1B1B;
  margin-bottom: 8px;
}
.empty-state-body {
  font-size: 13px;
  font-weight: 400;
  color: #666;
  max-width: 320px;
}
```

---

## FORBIDDEN

| Pattern | Why |
|---|---|
| `border-left: Xpx solid [color]` on any data row or card | Status is communicated by typography and indicators, not container borders |
| `background-color` on status rows/cards (e.g., red bg for overdue) | Too aggressive; use `.value-critical` on the value, not the container |
| `box-shadow` values not defined in the Elevation Scale | Use Levels 0–4 only |
| Any color not listed in the Color Tokens table or the explicit shadow/backdrop recipes | Breaks system coherence |
| `font-size` or `font-weight` not in the Typography Scale | — |
| Rounding corners on data rows or table containers | Flat containers only — use `border-radius: 4–6px` on cards only |
| Gradient backgrounds | Not present in reference; do not introduce |
| Opacity-based status coloring on containers | Not present in reference; do not introduce |
| Zebra striping on table rows | Structure comes from borders, not alternating backgrounds |
| `border-radius` larger than 6px on any component | Filter chips use 16px (pill); the explicitly defined signal geometry (such as circular indicators) is also exempt |
| Arbitrary component spacing | Use the Component spacing rules and documented geometry exceptions |
