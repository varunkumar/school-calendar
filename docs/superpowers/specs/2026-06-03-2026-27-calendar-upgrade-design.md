# School Calendar 2026-27 Upgrade — Design Spec

**Date:** 2026-06-03  
**Scope:** Data migration, routing, search overhaul, browser push notifications

---

## 1. Data Layer

### 1.1 Schema Extension

`src/data/data.json` becomes the **2026-27 active file**. The old file is archived as `src/data/data-2025-26.json` (unchanged).

The new `data.json` adds top-level sections alongside the existing `academic_calendar`:

```json
{
  "academic_calendar": [...],      // existing shape, new 2026-27 entries
  "school_timings": [...],         // NEW
  "fee_schedule": [...],           // NEW
  "ptm_schedule": [...],           // NEW
  "exam_schedule": [...],          // NEW
  "special_assemblies": [...],     // NEW
  "holidays": [...],               // NEW (authoritative list)
  "vacations": [...]               // NEW
}
```

**`school_timings`** — one entry per class group:
```json
{
  "group": "Pre-KG",
  "days": "Monday–Friday",
  "start": "9:30 AM",
  "end": "1:00 PM",
  "periods": [
    { "label": "Reporting Time", "time": "9:30 AM" },
    { "label": "Assembly", "time": "9:35 AM – 9:45 AM" }
  ]
}
```

**`fee_schedule`** — one entry per term/category:
```json
{
  "term": "Term 1",
  "class_range": "KG",
  "amount": 34700,
  "cutoff_start": "2026-04-01",
  "cutoff_end": "2026-04-12"
}
```

**`ptm_schedule`** — one entry per meeting:
```json
{
  "type": "Parent Interactive Meeting",
  "term": 1,
  "class_range": "KG, Classes I–XII",
  "dates": ["2026-07-31", "2026-08-01"]
}
```

**`exam_schedule`** — one entry per assessment block:
```json
{
  "assessment": "FA/PA1 Unit Test 1",
  "class_range": "X, XI",
  "date_start": "2026-04-08",
  "date_end": "2026-04-17"
}
```

**`special_assemblies`** — one entry per assembly:
```json
{ "topic": "World Environment Day", "date": "2026-06-05" }
```

**`holidays`** — authoritative list:
```json
{ "name": "Bakrid", "date": "2026-06-26" }
```

**`vacations`**:
```json
{
  "name": "Term 1 Holiday",
  "start": "2026-11-07",
  "end": "2026-11-25"
}
```

### 1.2 One-Time Deduplication

Before populating `data.json`, a standalone Node script (`scripts/dedup.js`) is run once:

1. Collect all events from all sources (monthly calendar entries + dedicated schedules)
2. Normalise text: lowercase, collapse whitespace, strip punctuation
3. Flag pairs with edit-distance ≤ 3 or substring containment (catches "deewali" / "diwali")
4. For flagged pairs: prefer the dedicated-schedule entry (richer structure); discard the monthly-calendar duplicate
5. Output a clean merged list for manual spot-check before writing to `data.json`

The script is kept in the repo for future years but is not part of the app runtime.

### 1.3 Category Consolidation

Old categories `assembly`, `competition`, and `trip` are retired. All three map to `activity` during data preparation. The category rename table:

| Old key | New key |
|---|---|
| `assembly` | `activity` |
| `competition` | `activity` |
| `trip` | `activity` |
| `academic` | `academic` |
| `exam` | `exam` |
| `holiday` | `holiday` |
| `vacation` | `vacation` |
| `fee` | `fee` (new) |
| `ptm` | `ptm` (new) |

Filter button display labels (7 total): **Academic · Exams · Activities · Holidays · Vacation · Fee · PTM**

### 1.4 `realCalendarData.js` Updates

- Imports `data.json` (unchanged import path)
- Existing `allCalendarEvents` continues to export the flat event array from `academic_calendar`
- New named exports added:
  - `schoolTimings` — raw array
  - `feeSchedule` — mapped to calendar events with category `"fee"`, includes `amount` and `class_range` metadata
  - `ptmSchedule` — mapped to calendar events with category `"ptm"`, includes `class_range` metadata
  - `examSchedule` — mapped to calendar events with category `"exam"`
  - `holidayList` — mapped to calendar events with category `"holiday"`
  - `vacationList` — mapped to calendar events with category `"vacation"`
- `allCalendarEvents` is updated to merge all the above into one flat array (replacing the current single-source approach)
- `special_assemblies` entries from `data.json` are mapped to category `"activity"` and merged in

### 1.5 Archive Data

`src/data/data-2025-26.json` is the renamed copy of the current `data.json`. It is imported only by the archive route (see Section 2).

---

## 2. Routing

### 2.1 Package

Add `react-router-dom` v6.

### 2.2 Route Structure

| Path | Component | Data source |
|---|---|---|
| `/` | `App` | `data.json` (2026-27) |
| `/archive/2025-26` | `App` | `data-2025-26.json` |

`App` receives a `calendarData` prop so both routes reuse the same component. `index.js` wraps in `<BrowserRouter>`.

### 2.3 Archive Banner

When rendered via the archive route, `App` shows a dismissible yellow banner at the top:
> "You are viewing the 2025–26 archive. [View current year →]"

---

## 3. Search (CMD+K Overlay)

### 3.1 Trigger

- Clicking the existing search box opens the modal (box itself no longer filters in-place)
- `⌘K` / `Ctrl+K` anywhere on the page opens the modal
- The search box in the control bar becomes a styled button that reads "Search events… ⌘K"

### 3.2 `SearchModal` Component

Self-contained component at `src/components/SearchModal.js`.

**Props:** `events` (full unfiltered list), `onEventClick(event)`, `onClose()`

**Layout:**
```
┌─────────────────────────────────────────┐
│  🔍  Search events...            [Esc]  │
├─────────────────────────────────────────┤
│  JULY 2026                              │
│  ● Fri 03 Jul  Holiday – Bakrid         │
│  ● Mon 06 Jul  No Bag Day (Classes I-II)│
│                                         │
│  AUGUST 2026                            │
│  ● Fri 15 Aug  Holiday – Independence.. │
└─────────────────────────────────────────┘
```

- Input autofocused on open
- Results appear after 1+ characters typed
- Grouped by month (chronological), each group has a sticky month label
- Each result: category color dot · date (short format) · title
- Empty state: "No events match" message
- Max visible results: 8 (scrollable)

**Keyboard nav:**
- `↑` / `↓` — move highlighted result
- `Enter` — open highlighted event in `EventModal`
- `Escape` — close modal

**Mobile:** full-screen sheet sliding up from the bottom.

### 3.3 App.js Changes

- Remove `searchTerm` state and `filteredEvents` search logic (filter-by-category logic stays)
- Search box replaced with a `<button>` that sets `showSearch: true`
- Global `keydown` listener for `⌘K` added in a `useEffect`
- `SearchModal` rendered conditionally, receives `events` (pre-filter, all categories) and `onEventClick={setSelectedEvent}`

### 3.4 Filter Buttons

Unchanged — still filter the calendar/sections view by category. Now clearly distinct from search.

---

## 4. Browser Push Notifications

### 4.1 Architecture

```
localStorage (prefs)
       │
       ▼
useNotifications hook  ──►  Service Worker (sw.js)  ──►  Browser Notification
       │
       ▼
NotificationSettings component
```

### 4.2 User Preferences Schema (localStorage key: `school_cal_notif_prefs`)

```json
{
  "enabled": true,
  "categories": ["academic", "exam", "activity", "holiday", "vacation", "fee", "ptm"],
  "advanceDays": [0, 1, 3, 7]
}
```

`advanceDays`: 0 = day-of morning (8 AM), others = that many days before at 8 AM.

### 4.3 `NotificationSettings` Component

Located at `src/components/NotificationSettings.js`. Opened via a bell icon (`🔔`) in `Header`.

**Panel sections:**
1. **Permission status** — shows current browser permission; button to request if not granted; instructions if blocked
2. **Master toggle** — enable/disable all notifications
3. **Categories** — checkbox per category with color dot (matches filter button colors)
4. **When to notify** — four checkboxes: "Day of (8 AM)", "1 day before", "3 days before", "1 week before"
5. **Save** button — writes to localStorage, triggers re-scheduling

### 4.4 `useNotifications` Hook (`src/hooks/useNotifications.js`)

- Reads prefs from localStorage
- On mount (and whenever prefs change): registers Service Worker, calls `scheduleNotifications(events, prefs)`
- `scheduleNotifications`: iterates events, for each `advanceDay` × each matching category, computes notification fire time, posts a `SCHEDULE` message to the SW
- Exposes: `{ prefs, updatePrefs, permissionStatus, requestPermission }`

### 4.5 Service Worker (`public/sw.js`)

- Listens for `SCHEDULE` messages containing `{ title, body, fireAt (ISO timestamp) }`
- Uses `setTimeout` internally for near-term notifications (within 24h)
- For longer-range scheduling: stores in IndexedDB, checks on each SW activation
- Handles `notificationclick` to focus/open the app tab

### 4.6 Notification Content

- **Title:** event title (e.g. "Holiday – Diwali")
- **Body:** "Tomorrow" / "In 3 days" / "Today" + date string
- **Icon:** school icon from `public/`
- **Tag:** `event-{id}-{advanceDays}` (prevents duplicates)

---

## 5. Event Categories (Final Set)

7 categories replace the previous 9. Color map and filter buttons updated everywhere (`App.js` `eventStyleGetter`, filter button list, `NotificationSettings`):

| Key | Display label | Color |
|---|---|---|
| `academic` | Academic | `#3b82f6` (blue-500) |
| `exam` | Exams | `#8b5cf6` (violet-500) |
| `activity` | Activities | `#06b6d4` (cyan-500) — absorbs assembly, competition, trip |
| `holiday` | Holidays | `#ef4444` (red-500) |
| `vacation` | Vacation | `#f59e0b` (amber-500) |
| `fee` | Fee | `#dc2626` (red-600) — new |
| `ptm` | PTM | `#7c3aed` (violet-700) — new |

### 5.1 School Timings UI

A new **"Timings"** tab added to the view-mode toggle (alongside Calendar and Sections).

`TimingsView` component at `src/components/TimingsView.js`:
- One card per class group (Pre-KG, LKG & UKG, Class I–II, Class III–XII)
- Each card shows: group name, hours, day coverage, period-by-period table
- Read-only, no filtering needed
- Also shows Office Hours and After School Activity (ASA) times as footer cards

### 5.2 Fee Amounts in EventModal

When `event.category === "fee"`, `EventModal` shows an additional section:
- Fee amount (formatted as ₹XX,XXX)
- Class range
- Cutoff date range

---

## 6. Files Changed / Created

| File | Action |
|---|---|
| `src/data/data.json` | Replace with 2026-27 data (extended schema) |
| `src/data/data-2025-26.json` | New — copy of old data.json |
| `src/data/realCalendarData.js` | Update — merge all new sources into allCalendarEvents |
| `scripts/dedup.js` | New — one-time dedup script (not bundled) |
| `src/index.js` | Add BrowserRouter |
| `src/App.js` | Add route props, remove search filter, add ⌘K listener, add SearchModal |
| `src/components/SearchModal.js` | New |
| `src/components/NotificationSettings.js` | New |
| `src/components/TimingsView.js` | New |
| `src/hooks/useNotifications.js` | New |
| `public/sw.js` | New — Service Worker |
| `package.json` | Add react-router-dom |

---

## 7. Out of Scope

- Year switcher UI (archive accessible only via direct URL)
- Editable timings or fee data in the UI (read-only display only)
