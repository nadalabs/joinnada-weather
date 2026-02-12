# Country Weather Explorer — Pairing Exercise

## Overview

You have **45 minutes** to build a small front-end app while pairing with your interviewer. The app lets a user select a country, then chains together multiple API calls to display weather data for that country's capital.

This is not a "get it pixel-perfect" exercise. We care about **how you model state**, **how you handle things going wrong**, and **how you think out loud** while building.

You're encouraged to use AI coding tools (Copilot, Cursor, etc.) during the exercise.

---

## The Problem

Build a single-page app with a **3-hop data chain**:

1. **Country** → User selects a country from a list
2. **Geocode** → Resolve the capital city to geographic coordinates (lat/lon)
3. **Weather** → Fetch current weather for those coordinates

Each hop depends on the previous one. Things can fail at any point in the chain.

---

## APIs (all free, no auth required)

### 1. REST Countries — Country list + capital

```
GET https://restcountries.com/v3.1/all?fields=name,cca2,capital,region
```

- `capital` is an array; some countries may have no capital listed
- Returns country name, ISO code (`cca2`), capital, and region
- Docs: https://restcountries.com

### 2. Open-Meteo Geocoding — Capital name → coordinates

```
GET https://geocoding-api.open-meteo.com/v1/search?name={CAPITAL}&count=10&language=en&countryCode={CCA2}
```

- May return **multiple results** for a given capital name
- Docs: https://open-meteo.com/en/docs/geocoding-api

### 3. Open-Meteo Forecast — Coordinates → weather

```
GET https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto
```

- Docs: https://open-meteo.com/en/docs

---

## Tech Stack

- **Next.js** (App Router)
- **TypeScript** (strongly preferred)
- **Tailwind CSS**
- shadcn/ui components are available if you want them

---

## What We Want to See

### Must-haves

- A **country selector** (dropdown, combobox, or similar)
- A **results panel** showing the chain of data: country info → geocode result → weather
- **Graceful handling when things break** — if one hop fails, still show what you have
- Some way to see **where data came from** (which API, when it was fetched)
- Handle the case where **geocoding returns multiple candidates**

### Things we'll talk about

- What happens if the user switches countries rapidly?
- Where does caching make sense?
- How would you extend this to compare two countries side-by-side?
- Where would you add observability in production?

---

## Getting Started

```bash
npm install
npm run dev
```

For tests (if you get to one):

```bash
npm test
```

---

## What Success Looks Like

At the end of 45 minutes, we expect to see a working chain from country → geocode → weather, with thoughtful handling of the messy middle — loading, errors, ambiguity, and state.

We'll spend the last ~10 minutes talking through tradeoffs and extensions. Unfinished code with a clear direction is better than complete code with unexamined assumptions.