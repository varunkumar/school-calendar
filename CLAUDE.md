# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start           # Dev server at http://localhost:3000
npm run build       # Production build
npm run build:netlify  # Production build with CI=false (suppresses warnings-as-errors)
npm test            # Run tests (Jest/React Testing Library)
npm test -- --testPathPattern=ComponentName  # Run a single test file
```

## Architecture

This is a Create React App project (React 18, no TypeScript) deployed on Netlify.

**Data flow:** All calendar events originate from `src/data/data.json` (raw JSON). `src/data/realCalendarData.js` parses and categorizes those entries into `allCalendarEvents` — an array of event objects with `date`, `endDate`, `category`, `title`, `description`, `classes`, etc. `App.js` imports this array as the single source of truth.

**Event categories** (used throughout for filtering and color-coding): `academic`, `holiday`, `assembly`, `vacation`, `exam`, `competition`, `activity`, `trip`. Colors are defined in `App.js` (`eventStyleGetter`) and `src/config/appConfig.js` (`theme.colors`).

**View modes in App.js:**
- `viewMode === 'calendar'`: Shows `react-big-calendar` (desktop, hidden on mobile) + `MobileAgenda` (mobile only, `<768px`) + `EventList` sidebar (desktop only)
- `viewMode === 'sections'`: Shows `SectionsView` spanning full width

**Key components:**
- `Header.js` — top nav bar
- `Dashboard.js` — statistics panel toggled by the Dashboard button
- `EventList.js` — upcoming events sidebar (desktop calendar view only)
- `EventModal.js` — modal shown when an event is clicked
- `MobileAgenda.js` — mobile-optimized agenda replacing react-big-calendar on small screens
- `SectionsView.js` — alternative list-by-category view
- `CategorySection.js` — used inside SectionsView to render one category

**Analytics:** `src/utils/analytics.js` wraps GA4 via `window.gtag`. GA only activates when `REACT_APP_GA_MEASUREMENT_ID` env var is set to a real ID (not `G-XXXXXXXXXX`). All user interactions (filter, search, export, view mode, calendar navigation) call specific tracking functions from this module.

**Configuration:** `src/config/appConfig.js` centralizes school name, academic year, theme colors, and feature flags — all driven by `REACT_APP_*` env vars with sensible defaults.

**Styling:** Tailwind CSS with a custom `primary` color scale (blue-based) defined in `tailwind.config.js`. Global styles and react-big-calendar overrides live in `src/index.css`.

## Adding or Updating Events

Edit `src/data/data.json` — `realCalendarData.js` parses it automatically. The parser handles `DD.MM.YYYY` dates, date ranges (`start-end`), and multi-date entries (`date1 & date2`). Category is inferred from the activity text via keyword matching in `categorizeEvent()`.

## Environment Variables

| Variable | Purpose |
|---|---|
| `REACT_APP_GA_MEASUREMENT_ID` | GA4 measurement ID (e.g. `G-XXXXXXXXXX`) |
| `REACT_APP_SCHOOL_NAME` | School name shown in header |
| `REACT_APP_ACADEMIC_YEAR` | Academic year label |
| `REACT_APP_CONTACT_EMAIL` | Contact email in config |
| `REACT_APP_PRIMARY_COLOR` | Theme primary color override |
| `REACT_APP_ENABLE_EXPORT` | Set to `false` to hide Export button |
| `REACT_APP_ENABLE_SEARCH` | Set to `false` to hide Search |

For Netlify deployment, set these in the Netlify dashboard under Site Settings > Environment Variables.
