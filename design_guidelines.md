# Habit Tracker Design Guidelines

## Design Approach

**Selected Approach**: Design System + Productivity App Reference  
**Justification**: As a utility-focused productivity tool with information-dense content requiring stability and consistency, this project benefits from systematic design patterns inspired by successful habit tracking and productivity applications (Habitica, Streaks, Notion, Linear).

**Key Design Principles**:
- Clarity over decoration: Every element serves a purpose
- Immediate feedback: Visual confirmation of all user actions
- Motivational design: Celebrate progress and streaks
- Scannable layouts: Quick daily check-ins are essential

---

## Core Design Elements

### A. Color Palette

**Primary Colors** (Dark Mode Default):
- Background Base: 222 15% 8%
- Surface: 222 15% 12%
- Surface Elevated: 222 15% 16%
- Border Subtle: 222 10% 20%

**Brand/Accent Colors**:
- Success Green: 142 76% 45% (habit completion)
- Success Green Muted: 142 50% 35%
- Warning Amber: 38 92% 50% (streaks/milestones)
- Neutral Gray: 222 10% 50% (incomplete states)
- Danger Red: 0 72% 51% (delete actions)

**Text Colors**:
- Primary Text: 222 10% 95%
- Secondary Text: 222 10% 70%
- Tertiary Text: 222 10% 50%

**Light Mode** (if needed):
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 222 15% 10%

### B. Typography

**Font Families**:
- Primary: Inter (via Google Fonts) - for UI elements, body text
- Monospace: JetBrains Mono - for statistics, streaks, numbers

**Type Scale**:
- Hero/Display: text-4xl font-bold (36px) - page titles
- Heading 1: text-2xl font-semibold (24px) - section headers
- Heading 2: text-xl font-semibold (20px) - card titles
- Body Large: text-base font-medium (16px) - primary content
- Body: text-sm (14px) - descriptions, secondary content
- Small: text-xs (12px) - metadata, timestamps
- Numbers/Stats: text-2xl font-mono font-bold - completion counts, streaks

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16  
- Component padding: p-4 to p-6
- Section spacing: space-y-6 to space-y-8
- Card gaps: gap-4 to gap-6
- Page margins: px-4 md:px-8 lg:px-12

**Grid Layouts**:
- Dashboard habit cards: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
- Statistics charts: grid grid-cols-1 lg:grid-cols-2 gap-6
- Max container width: max-w-7xl mx-auto

---

## Component Library

### Navigation
- Top navigation bar: Fixed, translucent backdrop-blur with subtle border
- Logo/brand left-aligned
- Navigation links: Dashboard, Statistics, Profile
- User avatar and status right-aligned with dropdown menu
- Mobile: Hamburger menu with slide-in drawer

### Dashboard - Habit Cards
**Card Structure**:
- Rounded corners: rounded-xl
- Background: Surface elevated with subtle border
- Padding: p-6
- Shadow on hover: hover:shadow-lg transition
- Drag handle: Subtle six-dot icon (top-left or left-center)

**Card Content Layout**:
- Habit name: text-xl font-semibold mb-2
- Description: text-sm text-secondary truncate mb-4
- Today's completion checkbox: Large (w-10 h-10), center-aligned, prominent with checkmark animation
- Mini 7-day calendar: Horizontal row of small circles (w-6 h-6) - filled green for complete, gray outline for incomplete
- Action buttons: Edit (pencil icon) and Delete (trash icon) - appear on hover or always visible on mobile, text-sm

**Empty State**: 
- Centered illustration placeholder
- "Start building your habits" text-lg
- Large "Add Your First Habit" button

### Habit Creation Modal
- Full-screen overlay with centered modal (max-w-lg)
- Modal background: Surface elevated with rounded-2xl
- Modal padding: p-8
- Form fields: Stacked with space-y-6
- Input styling: bg-surface border rounded-lg px-4 py-3 focus:ring-2 focus:ring-success
- Category badges: Clickable pills with rounded-full, different pastel background colors
- Action buttons: Primary (Create/Save) full green, Secondary (Cancel) outline gray

### Statistics Page
**Layout**: Full-width with max-w-7xl container

**Chart Cards**:
- White/Surface background with rounded-xl border
- Padding: p-6
- Chart title: text-xl font-semibold mb-4
- Chart container: min-h-64 to min-h-80

**Chart Types**:
1. Weekly Heatmap: Calendar-style grid with color intensity (7 columns × 4-5 rows)
2. Monthly Overview: Doughnut chart showing completion percentage
3. Streak Counter: Large number display with flame icon, monospace font
4. Best Habits: Horizontal bar chart with habit names
5. Completion Timeline: Line chart with smooth curves

**Filter Controls**:
- Pill-style toggle buttons: Last 7 days, 30 days, 90 days, All time
- Active state: bg-success text-white
- Inactive: bg-surface-elevated

### Profile Page
**Layout**: Two-column on desktop (md:grid-cols-3), single column mobile
- Left column (1/3): Profile card with photo, name, email, status
- Right column (2/3): Editable form fields

**Profile Photo**:
- Large circular avatar (w-32 h-32) with upload overlay on hover
- Border: border-4 border-success for uploaded photo, border-gray for placeholder
- Upload button: Appears on hover with camera icon

**Status Section**:
- Inline editable text with pencil icon
- Max 100 characters, text-base italic

### Toast Notifications
- Position: Fixed top-right (top-4 right-4)
- Background: Surface elevated with blur backdrop-blur-lg
- Border-left: 4px colored border (green for success, red for error, amber for warning)
- Icon + message + dismiss button
- Auto-dismiss after 4 seconds
- Slide-in animation from right

---

## Interactive States & Animations

**Hover States**:
- Cards: Subtle lift with shadow (transform translate-y-[-2px])
- Buttons: Brightness increase, no border color changes
- Checkboxes: Scale slightly (scale-105)

**Active/Completion States**:
- Checkbox completion: Checkmark slide-in with bounce
- Habit card on completion: Brief green glow effect (ring-2 ring-success/50)
- Success confirmation: Confetti animation (use canvas-confetti library)

**Loading States**:
- Skeleton screens for dashboard: Pulsing gray rectangles matching card dimensions
- Spinner for modal actions: Circular spinner replacing button text
- Charts: Loading shimmer effect

**Transitions**:
- All transitions: transition-all duration-200 ease-in-out
- Modal entrance: Fade + scale from 95% to 100%
- Page transitions: Fade between routes

---

## Images

**Hero Section**: Not applicable - Dashboard-first application
**Profile Photos**: User-uploaded circular avatars
**Empty States**: Minimalist line-art illustrations (use open-source libraries like unDraw or Storyset)
**Chart Icons**: Heroicons for streak flames, checkmarks, trends

---

## Accessibility & Quality

- All interactive elements: min-h-[44px] for touch targets
- Focus states: ring-2 ring-offset-2 ring-success outline-none
- ARIA labels on all icon buttons
- Keyboard navigation: Tab order follows visual hierarchy
- Color contrast: Minimum WCAG AA compliance (4.5:1 for text)
- Screen reader announcements for habit completions and toast notifications

---

## Responsive Breakpoints

- Mobile: < 768px - Single column, full-width cards, bottom navigation
- Tablet: 768px - 1024px - Two-column grid, condensed nav
- Desktop: > 1024px - Three-column grid, full navigation, sidebar stats