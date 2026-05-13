---
trigger: always_on
---

# Pickapp — Design System & Functional Specifications
> Multi-Vendor E-commerce Marketplace

**Theme:** Light (Mint-Tinted Neutral Canvas)
**Architecture:** Flat 2.0 / Information-Dense

Pickapp's design system is engineered for a high-volume, multi-vendor e-commerce marketplace catering to diverse product categories (electronics, fashion, crafts, home goods) sold by independent entrepreneurs. The aesthetic moves away from standard sterile white backgrounds, utilizing a carefully calculated color theory approach. It leverages a mint-tinted neutral canvas (60%), anchored by a trust-building brand green (30%), and punctuated by high-contrast orange/red calls-to-action (10%). The layout relies on Flat 2.0 principles—generous rounded corners, distinct category circles, and subtle elevation—to guide users intuitively through a dense catalog while accommodating the asynchronous smart-locker fulfillment model.

## Tokens — Colors

This palette strictly adheres to the 60-30-10 rule to ensure visual harmony, trust, and conversion optimization.

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Base (60%) | `#F2F9F5` | `--color-canvas-base` | Primary page background. A highly luminous, desaturated tint of the brand green to reduce eye strain while maintaining brand warmth. |
| Surface White | `#FFFFFF` | `--color-surface` | Product cards, modals, and isolated content containers to ensure product photography pops against the canvas. |
| Brand Green (30%) | `#299E60` | `--color-brand-green` | Primary navigation, trust indicators, secondary action buttons, and active UI states. Signals commerce readiness. |
| Action Orange (10%) | `#FF6B35` | `--color-action-orange` | Primary checkout CTA, "Buy Now" buttons, and urgency indicators. |
| Alert Red | `#E63946` | `--color-alert-red` | "Sale 50%", "New" badges, and destructive actions. |
| Ink Navy | `#121535` | `--color-ink-navy` | Primary text, headings, and strong borders. Provides high contrast without the harshness of pure black. |
| Muted Text | `#6C757D` | `--color-muted-text` | Secondary text, metadata, and inactive navigation items. |
| Border Light | `#E6E6E6` | `--color-border-light` | Structural dividers and subtle card outlines. |

## Tokens — Typography

The typography system is engineered for high information density, utilizing specific negative tracking to maintain readability in compact layouts.

### GTStandard-MRegular · `--font-gtstandard-mregular`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 9px, 11px, 12px, 14px, 16px
- **Line height:** 1.29, 1.33, 1.38
- **Letter spacing:** -0.0580em (9px), -0.0440em (11px), -0.0310em (12px), -0.0170em (14px), -0.0140em (16px)
- **Role:** Body text, card descriptions, general UI labels – a workhorse sans-serif with subtle compact tracking that creates a precise, information-dense feel.

### GTStandard-MMedium · `--font-gtstandard-mmedium`
- **Substitute:** Inter
- **Weights:** 500
- **Sizes:** 11px, 12px
- **Line height:** 1.33
- **Letter spacing:** -0.0180em (11px), -0.0170em (12px)
- **Role:** Used for compact UI elements and icons where slightly increased emphasis is needed without increasing weight.

### Shopify Sans · `--font-shopify-sans`
- **Substitute:** Poppins
- **Weights:** 400, 700
- **Sizes:** 10px, 14px, 24px, 32px
- **Line height:** 1.20, 1.57, 1.71
- **Letter spacing:** -0.0230em
- **Role:** Accent text for banners, links, and primary brand typography. Its unique letterforms give a distinct brand voice.

### Shopify Sans (Bold Variant) · `--font-shopify-sans-bold`
- **Substitute:** Poppins
- **Weights:** 700
- **Sizes:** 10px, 14px, 18px, 24px
- **Line height:** 1.20, 1.57, 1.71
- **Letter spacing:** -0.0230em
- **Role:** Bold variant for Shopify Sans, used specifically for the 'Pickapp' logo mark, major headings, and brand-critical emphasis.

### GTStandard-MSemibold · `--font-gtstandard-msemibold`
- **Substitute:** Inter
- **Weights:** 600
- **Sizes:** 12px, 14px
- **Line height:** 1.33
- **Letter spacing:** -0.0170em
- **Role:** Used for specific body text elements requiring clear distinction, such as bolded links or section titles, without a heavy visual presence.

## Tokens — Spacing & Shapes

**Base unit:** 4px
**Density:** Information-Dense

### Border Radius
- **Category Circles:** `50%` (Perfect circles for horizontal scrolling categories)
- **Primary Cards/Modals:** `16px` (Soft, approachable Flat 2.0 containers)
- **Inputs & Secondary Buttons:** `8px`
- **Primary CTA Buttons:** `50px` (Pill shape to distinguish main actions)
- **Badges:** `4px`

### Shadows (Flat 2.0 Elevation)
- **Subtle Card (Level 1):** `rgba(18, 21, 53, 0.05) 0px 4px 12px 0px` (Used on all product cards resting on the `#F2F9F5` canvas)
- **Hover Card (Level 2):** `rgba(18, 21, 53, 0.08) 0px 8px 24px 0px` (Interactive state)
- **Action Shadow (CTA):** `rgba(255, 107, 53, 0.25) 0px 6px 16px 0px` (Orange glow for primary actions)
- **Brand Shadow:** `rgba(41, 158, 96, 0.2) 0px 6px 16px 0px` (Green glow for secondary nav elements)

## Components

### Primary Action Button (The 10%)
- **Background:** `#FF6B35` (Action Orange)
- **Text:** `#FFFFFF` (GTStandard-MSemibold, 14px)
- **Radius:** `50px`
- **Shadow:** Action Shadow
- **Role:** Final checkout, "Buy Now", "Reserve Locker".

### Secondary Action Button (The 30%)
- **Background:** `#299E60` (Brand Green)
- **Text:** `#FFFFFF` (GTStandard-MSemibold, 14px)
- **Radius:** `8px`
- **Shadow:** Brand Shadow
- **Role:** Add to Cart, Filter application, general UI progression.

### Category Circles
- **Container:** `80px x 80px`, `50%` radius.
- **Background:** `#FFFFFF` with Subtle Card Shadow.
- **Content:** Product/Category icon centered.
- **Label:** Below circle, GTStandard-MMedium 11px, Ink Navy.
- **Role:** Horizontal scrolling navigation at the top of the landing page to densely pack all marketplace categories (Tech, Fashion, Home, etc.).

### Product Card
- **Background:** `#FFFFFF`
- **Radius:** `16px`
- **Shadow:** Subtle Card (Level 1)
- **Image Area:** Top 55% of card, 16px top-radius, 0px bottom-radius. Background `#F8F9FA` to isolate products with transparent backgrounds.
- **Content:** - Vendor Name: GTStandard-MRegular 11px, Muted Text.
  - Title: GTStandard-MSemibold 14px, Ink Navy.
  - Price: Shopify Sans Bold 18px, Brand Green.
  - Action: Action Orange pill button (small variant).

### Status Badges
- **Sale/New:** Background `#E63946`, Text `#FFFFFF`, 4px radius.
- **Locker Ready:** Background `#299E60`, Text `#FFFFFF`, 4px radius.

## Layout Principles

- **The Canvas Structure:** The background of the site is ALWAYS `--color-canvas-base` (`#F2F9F5`). This mint-tinted gray reduces harshness and instantly brands the whitespace. Content is placed inside `#FFFFFF` cards or containers.
- **Information Density:** Emulate Amazon's density but with modern typography. Use horizontal carousels, sidebar filters, and grid layouts (4-5 columns on desktop, 2 columns on mobile) to display maximum inventory without scrolling infinitely.
- **Category Prominence:** The top of the landing page must feature a dense row (or double row) of "Category Circles" to immediately communicate that this is an "everything" marketplace, not just a niche boutique.
- **Hardware Agnostic UI:** Product displays focus purely on the items and the transaction. "Smart Locker" fulfillment is treated as a seamless checkout option, not the focal point of the product browsing experience.

## Do's and Don'ts

### Do
- **Do** strictly apply the 60-30-10 color rule: `#F2F9F5` background, `#299E60` navigation/trust elements, `#FF6B35` final conversion actions.
- **Do** utilize the specified negative tracking for GTStandard/Inter fonts to maintain a compact, data-dense layout.
- **Do** use `#FFFFFF` for all product cards to ensure high-contrast framing against the mint-tinted canvas.
- **Do** use circular containers for top-level category navigation to soften the grid layout.
- **Do** use photography representing a diverse marketplace (apparel, electronics, crafts).

### Don't
- **Don't** use pure white (`#FFFFFF`) as the main body background; always use the canvas base.
- **Don't** use Brand Green (`#299E60`) for the "Buy Now" or "Pay" buttons; reserve that for Action Orange (`#FF6B35`) to create visual urgency.
- **Don't** use sharp 90-degree corners on cards or primary buttons; maintain the Flat 2.0 aesthetic.
- **Don't** use generic food imagery as the primary placeholder; show clothing, electronics, or artisan goods to reinforce the non-perishable marketplace model.

## Agent Prompt Guide

**Context for AI Architect:**
When building components, use the following exact specs:
- **Canvas:** `#F2F9F5`
- **Surface:** `#FFFFFF`
- **Nav/Secondary Action:** `#299E60`
- **Primary CTA/Urgency:** `#FF6B35`
- **Alert/Badge:** `#E63946`
- **Text:** `#121535` (Primary), `#6C757D` (Secondary)
- **Cards:** 16px radius, flat 2.0 subtle shadow.
- **Categories:** Circular (50% radius) scrolling lists.

Example Component Prompt:
"Create an e-commerce product card. Background #FFFFFF, 16px radius, subtle shadow. Title uses GTStandard-MSemibold at 14px (#121535). Price uses Shopify Sans Bold at 18px (#299E60). The card sits on a container with a #F2F9F5 background. Include a pill-shaped (50px radius) 'Add' button in #FF6B35."

## Quick Start (CSS/Tailwind)

### CSS Custom Properties
```css
:root {
  /* Colors - 60/30/10 Rule */
  --color-canvas-base: #F2F9F5;
  --color-surface: #FFFFFF;
  --color-brand-green: #299E60;
  --color-action-orange: #FF6B35;
  --color-alert-red: #E63946;
  --color-ink-navy: #121535;
  --color-muted-text: #6C757D;
  --color-border-light: #E6E6E6;

  /* Typography */
  --font-gtstandard: 'GTStandard-MRegular', 'Inter', sans-serif;
  --font-shopify: 'Shopify Sans', 'Poppins', sans-serif;

  /* Shadows (Flat 2.0) */
  --shadow-card: rgba(18, 21, 53, 0.05) 0px 4px 12px 0px;
  --shadow-card-hover: rgba(18, 21, 53, 0.08) 0px 8px 24px 0px;
  --shadow-btn-action: rgba(255, 107, 53, 0.25) 0px 6px 16px 0px;
  --shadow-btn-brand: rgba(41, 158, 96, 0.2) 0px 6px 16px 0px;

  /* Radii */
  --radius-badge: 4px;
  --radius-input: 8px;
  --radius-card: 16px;
  --radius-pill: 50px;
  --radius-circle: 50%;
}
```

### Tailwind v4 Configuration
```css
@theme {
  /* Colors */
  --color-canvas: #F2F9F5;
  --color-surface: #FFFFFF;
  --color-brand: #299E60;
  --color-action: #FF6B35;
  --color-alert: #E63946;
  --color-ink: #121535;
  --color-muted: #6C757D;
  --color-border: #E6E6E6;

  /* Shadows */
  --shadow-card: rgba(18, 21, 53, 0.05) 0px 4px 12px 0px;
  --shadow-card-hover: rgba(18, 21, 53, 0.08) 0px 8px 24px 0px;
  --shadow-action: rgba(255, 107, 53, 0.25) 0px 6px 16px 0px;
  --shadow-brand: rgba(41, 158, 96, 0.2) 0px 6px 16px 0px;

  /* Border Radius */
  --radius-badge: 4px;
  --radius-input: 8px;
  --radius-card: 16px;
  --radius-pill: 50px;
  --radius-circle: 50%;
}
```