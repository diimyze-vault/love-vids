# VibeVids.ai Definitive Design System

**Version 5.0 - "Neural Flatness"**

This document establishes the absolute standards for the VibeVids.ai interface. Inspired by the surgical precision of **Vercel**, **Linear**, and **Shadcn**, this system prioritizes extreme minimalism, rapid perceived performance, and a sophisticated flat aesthetic.

---

## 1. Core Principles

- **Monochromatic Base**: 95% of the UI is neutral grays. Colors are reserved for intent.
- **Red as Intent**: The primary Red (`#E11D48`) is used for primary actions, success paths, and brand highlights.
- **Geometric Rigor**: Everything sits on a 4px/8px grid. Alignment is non-negotiable.
- **Flat Depth Protocol**: Shadows are deprecated. Depth is achieved via 1px solid borders, muted backgrounds, and subtle inset box-shadows.

---

## 2. Color Palette (Neural Grayscale + Primary Red)

### 2.1 Primary Accent

| Name            | Hex       | HSL            | Tailind     | Usage                                |
| :-------------- | :-------- | :------------- | :---------- | :----------------------------------- |
| **Brand Red**   | `#E11D48` | `335 84% 55%`  | `primary`   | CTAs, Primary Tabs, Active States    |
| **Red Surface** | `#FFF1F2` | `355 100% 97%` | `primary/5` | Hover backgrounds, subtle highlights |

### 2.2 Functional Grayscale

| Tier            | Light Hex | Dark Hex  | Usage                             |
| :-------------- | :-------- | :-------- | :-------------------------------- |
| **Background**  | `#FFFFFF` | `#050505` | Global body background            |
| **Surface**     | `#FAFAFA` | `#0A0A0A` | Card/Sidebar surfaces             |
| **Muted**       | `#F4F4F5` | `#18181B` | Secondary inputs, disabled states |
| **Border**      | `#E4E4E7` | `#27272A` | Standard structural borders       |
| **Border-High** | `#D4D4D8` | `#3F3F46` | Active/Focused borders            |

---

## 3. Typography (The "Outfit" Protocol)

### 3.1 Headings

| Level          | Size        | Weight           | Tracking  | Case  | Pattern                                              |
| :------------- | :---------- | :--------------- | :-------- | :---- | :--------------------------------------------------- |
| **H1 (Hero)**  | `3.75rem`   | `700` (Bold)     | `-0.02em` | Mixed | `text-6xl font-bold tracking-tight`                  |
| **H2 (Title)** | `1.875rem`  | `600` (Semibold) | `-0.02em` | Mixed | `text-3xl font-semibold tracking-tight`              |
| **H3 (Label)** | `0.6875rem` | `600` (Semibold) | `0.1em`   | UPPER | `text-[11px] font-semibold uppercase tracking-wider` |

### 3.2 Body

- **Base**: `14px` (0.875rem), `400` weight, `1.5` line-height.
- **Medium**: `14px`, `500` weight (for emphasis).
- **Small**: `12px`, `500` weight, `text-muted-foreground`.

---

## 4. Geometry & Structural Depth

### 4.1 Border Radii

- **Base Components**: `8px` (`rounded-lg`) - Inputs.
- **Interactive Triggers**: `9999px` (`rounded-full`) - All buttons, chips, and primary triggers.
- **Large Components**: `12px` (`rounded-xl`) - Standard cards, modals.
- **Main Layout**: `16px` (`rounded-2xl`) - Parent containers.

### 4.2 Depth (The "Neural Flat" Stack)

- **Standard Card**: `border border-border`, `bg-card`. Double borders for nesting.
- **Interactive Card**: Transition to `border-primary/20` or `border-border-high`.
- **Inset Depth**: All shadows are deprecated. Use `bg-muted/10` or variations of border opacities for depth components.

---

## 5. Animations & Transitions (VibeVids Kinetic Signature)

### 5.1 The "Tactile" Spring

Used for hover states and button presses.

- **Stiffness**: 260
- **Damping**: 20
- **Scale**: `0.99` on tap, no scale on hover (prefer color/border change).

### 5.2 The "Neural" Entrance

Used for page transitions and modal appearances.

- **Initial**: `opacity: 0, scale: 1, y: 10` (no scale transition for flat look).
- **Animate**: `opacity: 1, scale: 1, y: 0`
- **Duration**: `0.3s`
- **Ease**: `[0.23, 1, 0.32, 1]` (Cubic Bezier).

---

## 6. Components & State

### 6.1 Buttons

- **Primary**: Brand Red, white text, no shadow.
- **Secondary**: `bg-background`, `border border-border`, hover: `bg-muted`.
- **Ghost**: No background, no border, hover: `bg-muted`.

### 6.2 Loaders

- **Spinner**: 2px stroke, `border-t-primary`, 1s infinite spin.
- **Skeleton**: Neural gray shimmer (`bg-muted/30`), pulse.

### 6.3 Sidebar

- Width: `280px`.
- Navigation items: `h-10`, `semibold`, text-muted-foreground. Active: `bg-primary/5 text-primary`, `border-r-2 border-primary`.
