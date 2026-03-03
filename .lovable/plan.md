

# Motion.ly Landing Page

## Overview

Create a dedicated product landing page at `/` that introduces Motion.ly to visitors before they enter the app. The current app (SymptoMap) moves to `/app`. The landing page will be a clean, modern, scroll-based page with the sections you described.

## Route Changes

- `/` -- New landing page component
- `/app` -- Current SymptoMap app (moved from `/`)
- All other routes remain unchanged

## Landing Page Sections

### 1. Hero Section (above the fold)
- Full-width gradient background (teal-to-dark, subtle animated grain/motion)
- App logo (`/images/app-logo.png`) prominently displayed
- Title: "Track neurodegenerative symptoms through research-grade, gamified tasks."
- Subtitle explaining audience + science (clinicians, researchers, AI/MediaPipe)
- Primary CTA: "Launch Demo" (links to `/app`)
- Secondary CTA: "See how it works" (smooth scroll down)
- Large spacing, Poppins typography, minimal text

### 2. "Who It's For" Strip
- Three cards in a responsive row: Clinicians, Researchers, Patients/Participants
- Each card: icon, title, short description
- Uses the existing teal/amber/purple brand palette from the app's color constants

### 3. "How It Works" -- 3 Steps
- Horizontal step layout with connecting lines/arrows
- Step 1: Design tasks (game controller icon)
- Step 2: Capture signals (camera/AI icon)
- Step 3: Track change over time (trend/chart icon)
- Short description under each with the copy you provided

### 4. Science and Technology Section
- Two-column layout (stacks on mobile)
- Left: Science credibility points (clinical outcome measures, longitudinal analysis, MediaPipe explanation)
- Right: Tech stack list (React, TypeScript, Tailwind, shadcn-ui, MediaPipe, Supabase)
- Clean card-based design, not a wall of text

### 5. "What You'll See" -- Screenshot Tiles
- Three placeholder tiles: Task Dashboard, Session UI, Trend View
- Each tile: illustration/placeholder area + caption
- These can be swapped for real screenshots later

### 6. Ethics and Disclaimer
- Subtle but visible section with a warning-style banner
- "MotionLy is not a medical device..."
- "Any clinical use must follow ethics/IRB approval..."

### 7. Final CTA Section
- "Ready to explore MotionLy?"
- Primary button: "Open App" (links to `/app`)
- Secondary: "Learn more about our research approach"

## Design Approach

- Uses existing brand colors from SymptoMap (teal `#1DA39A`, black `#0E0E0E`, warm grays)
- Poppins font (already loaded by SymptoMap's GlobalStyles)
- Fraunces serif for headings (also already loaded)
- Responsive: looks great on both mobile and desktop
- Smooth scroll behavior, subtle fade-in animations on scroll
- Full-width layout (not constrained by the App.css `max-width: 1280px`)

## Technical Plan

### Files to create
- `src/pages/Landing.tsx` -- Full landing page component with all 7 sections

### Files to modify
- `src/App.tsx` -- Add `/app` route for SymptoMap, change `/` to render Landing
- `src/pages/Index.tsx` -- Update to render the Landing page instead of SymptoMap

### No new dependencies needed
- All styling via inline styles (matching the existing SymptoMap pattern) and Tailwind utility classes
- Icons from lucide-react (already installed)
- Smooth scroll via native `scrollIntoView`

