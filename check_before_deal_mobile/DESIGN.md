---
name: Check Before Deal Mobile
colors:
  surface: '#f7f9fd'
  surface-dim: '#d8dade'
  surface-bright: '#f7f9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f8'
  surface-container: '#eceef2'
  surface-container-high: '#e6e8ec'
  surface-container-highest: '#e0e3e6'
  on-surface: '#181c1f'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3134'
  inverse-on-surface: '#eff1f5'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#00569c'
  on-tertiary: '#ffffff'
  tertiary-container: '#196fc0'
  on-tertiary-container: '#ebf1ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a4c9ff'
  on-tertiary-fixed: '#001c39'
  on-tertiary-fixed-variant: '#004883'
  background: '#f7f9fd'
  on-background: '#181c1f'
  surface-variant: '#e0e3e6'
  surface-card: '#FFFFFF'
  risk-safe: '#15803D'
  risk-safe-bg: '#ECFDF5'
  risk-safe-border: '#A7F3D0'
  risk-caution: '#B45309'
  risk-caution-bg: '#FFFBEB'
  risk-caution-border: '#FDE68A'
  risk-high: '#B91C1C'
  risk-high-bg: '#FEF2F2'
  risk-high-border: '#FECACA'
  state-pressed-blue: '#1D4ED8'
  state-destructive-hover: '#DC2626'
  card-outline-active: '#BFDBFE'
  tab-bg-active: '#E2E8F0'
typography:
  headline-lg:
    fontFamily: Noto Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Noto Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Noto Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Noto Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  label-md:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Noto Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
  caption:
    fontFamily: Noto Sans
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
---

## Brand & Style

The design system is crafted for a mobile-first safety and fraud-prevention experience targeted at students and young adults transacting in peer-to-peer digital marketplaces. 

### Brand Personality & Emotional Atmosphere
The aesthetic communicates four key pillars:
- **Trustworthy & Authoritative:** Calibrated to instill reassurance without clinical intimidation. Financial and identity verification requires clarity, order, and definitive feedback.
- **Approachable & Empathetic:** Tailored to young university students who need straightforward guidance, not bureaucratic jargon.
- **Vigilant & Decisive:** Clear visual signals communicate risk gradations without inducing panic, relying on precise iconography and dual-channel risk communication.

### Design Movement
The system balances **Modern Clean Functionalism** with **Tonal Layering**. It pairs soft, welcoming surfaces (`#F6F8FC` tinted backdrops, high-radius cards) with high-contrast, structured information density. Visual hierarchy is achieved via elevation tiers, rounded surfaces, crisp status indicators, and dedicated 48px touch bounding boxes.

## Colors

The palette establishes an authoritative blue primary tone supported by a slate dark neutral, anchored over a calm, tinted background canvas (`#F6F8FC`).

### Key Roles
- **Primary (`#2563EB`):** Applied to primary actions, interactive focus rings, active navigation icons, and system verification markers.
- **Secondary (`#1E293B`):** Deep charcoal slate used for high-contrast primary typography, headers, and prominent structural framing.
- **Tertiary (`#60A5FA`):** Ambient accent for subtle highlights, interactive outlines, and soft chip borders.
- **Neutral Canvas (`#F6F8FC`):** The foundational mobile view background, creating contrast against crisp white container cards.

### Risk & Status Indicator System
Risk colors must **never** be presented in isolation. Every risk status is enforced with a mandatory triplet: an icon (e.g., checkmark, warning triangle, shield alert), an explicit Thai text label, and the tokenized semantic container.
- **Safe (`#15803D`):** Background `#ECFDF5`, Border `#A7F3D0`. Indicates verified bank-name matches, high verified transactions, and clean track records.
- **Caution (`#B45309`):** Background `#FFFBEB`, Border `#FDE68A`. Indicates incomplete data, unverified accounts, or suspicious price gaps below market.
- **High Risk (`#B91C1C`):** Background `#FEF2F2`, Border `#FECACA`. Indicates reported accounts, mismatching account names, or flagged mobile numbers.

## Typography

The type system is built specifically around the vertical metrics and looped ascender/descender nuances of the Thai script (Noto Sans / Noto Sans Thai family). 

### Principles & Metrics
- **Thai Loop Readability:** Thai glyphs with complex vowel stacking and tone marks require a baseline line-height expansion of at least 1.5x–1.6x the font size to eliminate clipping and visual density fatigue.
- **Base Scale:** The standard reading size for regular body copy is fixed at `16px` (`body-lg`) to ensure effortless legibility on 390px-wide viewport devices.
- **Numerical Alignment:** Monospace or tabular number figures are prioritized for critical transaction fields: Bank accounts, Proof Codes (`KT-4829`), telephone digits, and Thai Baht currency values (`฿900`).

## Layout & Spacing

The system is calibrated strictly for mobile viewport execution (target baseline: 390px × 844px).

### Layout System
- **Single-Column Fluid Shell:** Mobile canvases rely on a single primary content column bounded by a persistent horizontal canvas margin of `16px` (`1rem`).
- **Vertical Flow Hierarchy:** Component sections (e.g., Seller Profile Card to Risk Analysis Breakdown) maintain a consistent gap of `16px` (`space-md`), expanding to `20px` (`space-lg`) between distinct thematic groups.
- **Safe Areas & Chrome Enclosures:**
  - **Top App Bar:** Height fixed at `56px` plus device status-bar safe-area offset.
  - **Bottom Tab Navigation Bar:** Height fixed at `64px` plus device bottom home-indicator inset.
  - **Touch Zones:** All actionable elements conform to a mandatory minimum bounding box of `48px × 48px`, regardless of visual icon or label dimensions.

## Elevation & Depth

Visual hierarchy uses physical-like surface layering rather than intense drop shadows, ensuring clarity in high-glare environments.

### Elevation Levels
- **Canvas Base (Level 0):** Pure `#F6F8FC`. Flat, non-interactive foundation.
- **Card Containers (Level 1):** `#FFFFFF` with an ambient diffused shadow: `0px 2px 8px rgba(15, 23, 42, 0.06)`, bounded by a `1px` subtle border of `#E2E8F0`.
- **Raised Tappable Rows & Floating Headers (Level 2):** Elevated interactive components and floating toolbars carry `0px 4px 14px rgba(15, 23, 42, 0.08)`.
- **System Overlays & Dark Toasts (Level 3):** Toasts (such as the "คัดลอกแล้ว" alert) float centered above the bottom bar with an opaque dark slate container (`#0F172A`), zero border, and deep ambient projection: `0px 10px 25px -5px rgba(0, 0, 0, 0.3)`.

## Shapes

The interface embraces a gentle, rounded aesthetic to preserve a friendly and approachable feel while maintaining structural order.

### Shape Application
- **Standard Cards & Detail Modals:** `16px` corner radius (`rounded-xl` in this scale) sets the rhythm for all information groupings.
- **Interactive Buttons & Input Fields:** Uniform `12px` to `16px` border-radius ensuring touch friendliness.
- **Risk Badges & Status Chips:** Full pill geometry (`9999px`) to immediately distinguish categorical indicators from square layout cards.
- **Bottom Navigation Chrome:** Subtle top-edge rounding (`16px 16px 0 0`) with smooth surface clip.

## Components

### 1. Buttons
- **Primary CTA:** Solid `#2563EB` fill, white text, 48px minimum height, 16px corner radius.
  - *Pressed state:* Darkens immediately to `#1D4ED8`.
- **Destructive Button (e.g., "ยกเลิก", "รายงาน"):** Soft neutral or transparent baseline.
  - *Active / Pressed state:* Flashes solid `#DC2626` background with white text or sharp `#B91C1C` perimeter.
- **Secondary / Ghost Button:** Transparent background, `1.5px` border in `#2563EB`, text `#2563EB`.

### 2. Cards & Data Rows
- **Card Styling:** `#FFFFFF` background, 16px radius, soft shadow, padding of `16px`.
- **Interactive Card / Row State:** Any tappable card or detail row displays a `1.5px` border outline of `#BFDBFE` upon touch/press.
- **Read-Only / Pre-filled Fields:** Rendered as structured data rows (label in `#64748B`, bold value in `#1E293B`) with no text-cursor, no editable box styling, and no chevron if non-tappable.

### 3. Risk Indicator Badges & Banners
- **Safe Banner:** Icon (Shield Check) + Label "ปลอดภัย" + Safe Green `#15803D` text on `#ECFDF5` background.
- **Caution Banner:** Icon (Alert Triangle) + Label "ควรระวัง" + Amber `#B45309` text on `#FFFBEB` background.
- **High-Risk Banner:** Icon (Octagon Exclamation) + Label "ความเสี่ยงสูง" + High-Risk Red `#B91C1C` text on `#FEF2F2` background.

### 4. Navigation Chrome
- **Root Screen Header:** Left-aligned screen title, right-aligned action container hosting the Notification Bell icon (48x48px tap target).
- **Non-Root Header:** Left-aligned back chevron (`24px` icon inside 48x48px container) followed by the contextual view title.
- **Bottom Tab Navigation:** 4 tabs evenly spaced across 390px ("เช็ก", "เช็กลิสต์", "โปรไฟล์", "รายงาน"). Active tab receives a `#2563EB` icon and label tint plus an ambient `#E2E8F0` pill background behind the tapped slot.

### 5. Notification Toasts
- **Confirmation Toast (e.g., "คัดลอกแล้ว"):** Deep charcoal pill (`#0F172A`), white 14px medium typography, centered horizontally 24px above the bottom tab bar or viewport bottom, with no interactive dismiss required.