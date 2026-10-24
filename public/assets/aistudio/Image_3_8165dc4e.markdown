---
name: Neo-Utility Bento Grid
colors:
  surface: '#111317'
  surface-dim: '#111317'
  surface-bright: '#37393e'
  surface-container-lowest: '#0c0e12'
  surface-container-low: '#1a1c20'
  surface-container: '#1e2024'
  surface-container-high: '#282a2e'
  surface-container-highest: '#333539'
  on-surface: '#e2e2e8'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e2e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#ffffff'
  on-tertiary: '#00363a'
  tertiary-container: '#7df4ff'
  on-tertiary-container: '#006f77'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#7df4ff'
  tertiary-fixed-dim: '#00dbe9'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f54'
  background: '#111317'
  on-background: '#e2e2e8'
  surface-variant: '#333539'
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  code-pnr:
    fontFamily: Space Mono
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 22px
    letterSpacing: 0.08em
  label-mono:
    fontFamily: Space Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-pill:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system embodies a **Neo-Utility Tactile Bento** aesthetic engineered for Gen Z digital natives. The platform balances high-density utility with kinetic club-culture vibrancy, transforming chaotic multi-city itineraries, shared booking splits, boarding passes, and lodging logistics into razor-sharp, glanceable modular cards. 

The emotional tone is hyper-organized, assertive, and effortlessly cool—drawing equally from industrial logistics interfaces, tactical HUD flight trackers, and contemporary brutalist print editorial. It avoids dull corporate minimalism in favor of visceral tactile feedback, purposeful contrast, high-speed information ingestion, and playful micro-moments.

## Colors

The palette operates in a default dark mode environment calibrated to evoke deep tactical instrument displays with high-voltage neon punch points.

- **Primary (`#CCFF00` - Electric Lime):** Serves as the primary beacon for primary actions, active status tickers, confirmed bookings, and critical visual cues.
- **Secondary (`#A855F7` - Vivid Violet/Magenta):** Accents split-payments, social collaborator tags, curated travel guides, and auxiliary micro-badges.
- **Tertiary (`#00F0FF` - Cyan Data):** Reserved for technical tracking metrics, live gate updates, weather telemetry, and transit timelines.
- **Neutral Base (`#0C0E12` - Pitch Charcoal):** The canvas background, accompanied by elevated surface cards (`#14171F`, `#1C202B`) and precise technical borders (`#282E3D`). Text layers utilize stark off-white (`#F3F4F6`) for absolute contrast and slate tones (`#94A3B8`) for secondary metadata.

## Typography

Typography pairs geometric forwardness with aviation-grade technical precision:

- **Headlines (Space Grotesk):** Provides structured punchiness with eccentric character cuts (like the distinctive `k` and `g`), lending an immediate digital editorial flavor.
- **Body Text (DM Sans):** Chosen for uncompromised legibility across complex schedules, packing lists, and notes. Its geometric balance maintains harmony with Space Grotesk.
- **Utility & Metadata (Space Mono):** Used for ticket reference codes (PNR), terminal numbers, flight numbers, seat rows, coordinate anchors, and UTC timestamps. It instantly telegraphs "system data" and prevents reading ambiguity between letters and numbers.

## Layout & Spacing

The layout is built upon an asymmetric **Bento Grid** architecture. Interfaces prioritize information modularity where distinct components (e.g., flight timeline, weather module, pack list progress, currency converter) lock into unified spatial matrices.

- **Grid System:** A 12-column layout on desktop (`1280px` max fluid wrapper) with dynamic multi-span cards (`col-span-3`, `col-span-4`, `col-span-6`, `col-span-8`, `col-span-12`). Mobile condenses into a stacked 2-column or 1-column responsive card stream.
- **Rhythm:** Spacing tokens govern both interior container padding and exterior grid gutters. Component layouts enforce consistent edge-to-content padding (`space-md` on compact widgets, `space-lg` on hero containers) to sustain clean structural compartmentalization without clutter.

## Elevation & Depth

Visual hierarchy uses a hybrid of **tonal layering**, **tactile bevels**, and **frosted neo-glassmorphism** over deep charcoal fields:

- **Tonal Layers:** The baseline canvas rests at `#0C0E12`. Level 1 bento containers rest at `#14171F` with a crisp 1px stroke (`rgba(255, 255, 255, 0.08)`). Level 2 sub-tiles (nested modules within cards) sit on `#1C202B`.
- **Glassmorphism:** Sticky floating navigation docks, filter bars, and modal sheets utilize `backdrop-filter: blur(16px)` with semi-transparent surfaces (`rgba(20, 23, 31, 0.75)`) and hairline illumination borders (`rgba(255, 255, 255, 0.15)` top edge).
- **Tactile Pop & Ambient Glow:** Interactive primary elements feature hard-edge bottom shadows (1px 2px 0px rgba(0,0,0,0.8)) or neon ambient bloom (`box-shadow: 0 0 24px -4px rgba(204, 255, 0, 0.25)`) to signal focus states and live departure warnings without obscuring structural borders.

## Shapes

The shape system pairs high-radius bento structural envelopes (`rounded-2xl` / 16px) with fully rounded utility pill modules (`rounded-full` / 9999px).

- **Bento Containers & Modals:** Built with standard rounded-2xl geometries (16px / 1rem to 1.5rem), establishing friendly yet engineered card surfaces.
- **Chips, Pills, & Action Triggers:** Boarding statuses, passenger tags, and action buttons employ complete capsule shapes (`rounded-full`), generating an immediate physical contrast against the squared-off structural grid of the canvas.
- **Inner Data Cells:** Nested stats, departure times, and baggage badges take tighter corner radii (`8px`) to maintain concentric alignment within their parent containers.

## Components

### Buttons
- **Primary Action:** Pill-shaped (`rounded-full`), background `#CCFF00`, text `#0C0E12`, font weight 700 with subtle tracking. On hover: scale(1.02) with active neon glow (`0 0 16px rgba(204,255,0,0.4)`). Active state applies a tactile 1px downward shift.
- **Secondary / Ghost:** Dark slate surface (`#1C202B`) with a 1px border (`#282E3D`), off-white typography, transitioning to a pure white border on hover.
- **Icon Actions:** Circular tactile buttons (`w-10 h-10 rounded-full`) featuring monochromatic or neon-tinted glyphs.

### Chips & Pill Badges
- **Status Pills:** Compact capsules displaying flight statuses (`ON TIME`, `DELAYED`, `BOARDING`). Features a pulsing 6px status dot alongside Space Mono bold typography.
- **Collaborator Pills:** Small avatar + handle badge with vivid violet/magenta accent stroke designating trip collaborators and cost-split assignments.

### Bento Itinerary Cards
- Modular surfaces with a hairline border (`1px solid rgba(255, 255, 255, 0.08)`), dark charcoal fill (`#14171F`), and internal auto-layout grid.
- Top bar houses flight/hotel title alongside a monospaced PNR indicator (e.g., `PNR: 8F9-2KA`). The center shows departure/arrival codes in massive Space Grotesk, interconnected by transit vector graphics.

### Input Fields & Search Bars
- Recessed slate background (`#14171F`) with an inset 1px border.
- Floating monospaced field tags (`ORIGIN`, `DESTINATION`, `DATES`).
- Focused states trigger an Electric Lime border highlight (`#CCFF00`) with zero fuzzy glow, sustaining pure mechanical sharpness.

### Checkboxes & Toggle Switches
- **Checkboxes:** Rounded squares (4px) in solid dark fill, shifting to `#CCFF00` with black check icons when toggled on packing lists.
- **Toggles:** Tactile pill switches with physical toggle knobs that slide with spring physics.

### Special System Components
- **Flight Barcode / QR Ticket Stub:** Detachable perforated bento sub-tile featuring SVG barcodes, monospaced seat allocations, and quick Apple Wallet / Google Wallet pass sync triggers.
- **Split Bill Meter:** High-energy progress bar divided into multi-color segments (Lime, Violet, Cyan) showing who paid what in real-time.