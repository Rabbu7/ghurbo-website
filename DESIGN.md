# Design System Specification: High-End Editorial Travel Experience

## 1. Overview & Creative North Star: "The Verdant Curator"
This design system moves beyond the utility of a standard travel booking engine and into the realm of a high-end digital editorial. Our Creative North Star is **"The Verdant Curator."** 

We are not just building a platform; we are framing the lush, riverine beauty of Bangladesh through a lens of sophisticated modernism. This system rejects the "boxy" nature of traditional Material Design in favor of **Organic Asymmetry**. By utilizing generous white space, overlapping high-quality imagery, and a tonal-first depth model, we create an interface that feels like a premium travel magazine—tactile, breathable, and deeply intentional.

### The Editorial Shift
*   **Asymmetric Breathing Room:** We break the rigid grid by allowing imagery to bleed off-canvas or overlap container edges.
*   **Mobile-First Sophistication:** On desktop, we avoid "stretching" the mobile UI. Instead, we use the additional real estate to introduce "white-space-as-luxury," treating the screen like a gallery wall rather than a data table.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
Our palette is a sophisticated extraction of the Bangladeshi landscape—deep paddy greens, riverine blues, and sunset ochres. 

### The "No-Line" Rule
**Strict Mandate:** 1px solid borders are prohibited for sectioning or containment. 
Structure must be defined through **Background Color Shifts**. For example:
*   A `surface-container-low` (#bdfeec) card sitting on a `surface` (#d7fff3) background.
*   A `surface-container-highest` (#9aecd7) navigation bar transitioning into a `surface-container` (#b0f6e3) body.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. To create depth, we nest containers using the Material 3 functional tiers:
1.  **Base Layer:** `surface` (#d7fff3)
2.  **Sectioning:** `surface-container-low` (#bdfeec)
3.  **Actionable Cards:** `surface-container-lowest` (#ffffff)
4.  **Prominent Modals:** `surface-container-high` (#a5f1dd)

### The Glass & Gradient Rule
To add "soul" to the interface:
*   **Hero CTAs:** Use a subtle linear gradient from `primary` (#00694d) to `primary-container` (#9ef4d0) at a 135-degree angle.
*   **Floating Navigation:** Utilize **Glassmorphism**. Apply `surface` at 70% opacity with a `backdrop-filter: blur(24px)`. This integrates the UI with the travel imagery behind it.

---

## 3. Typography: Authoritative Sans-Serif
We pair **Plus Jakarta Sans** (for headlines) with **Inter** (for utility/body) to balance personality with extreme legibility.

*   **Display (Plus Jakarta Sans):** Used for "Dream Destinations" and editorial headers. The large scale (`display-lg`: 3.5rem) creates a high-contrast, premium feel.
*   **Headline (Plus Jakarta Sans):** Bold and tight-tracking. These serve as the "voice" of the platform.
*   **Title (Inter):** Medium weights for card headers and navigation. Inter provides a "system-level" trust that feels secure for booking.
*   **Body & Label (Inter):** Optimized for readability in high-density travel data (itineraries, pricing).

**Typography as Hierarchy:** Use `on-surface-variant` (#2d6558) for secondary metadata to create a natural visual recedence without using "grey" text, maintaining the lush green tonal harmony.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are a fallback, not a first choice.

### The Layering Principle
Depth is achieved by stacking. A `surface-container-lowest` (#ffffff) card placed on a `surface-container-low` (#bdfeec) background creates a "soft lift" that feels architectural rather than artificial.

### Ambient Shadows
Where floating elements (like FABs or sticky booking bars) are required:
*   **Shadow Color:** Use a tinted version of `on-surface` (e.g., `#00362c` at 6% opacity).
*   **Blur:** Extra-diffused (Blur: 40px, Spread: -5px). Shadows should be felt, not seen.

### The "Ghost Border" Fallback
If accessibility requires a boundary, use a **Ghost Border**: `outline-variant` (#80b8a9) at **15% opacity**. Never use 100% opaque outlines.

---

## 5. Components: Stylized Primitives

### Cards (The Core Component)
*   **Style:** No borders. Large corner radius (`rounded-lg`: 2rem).
*   **Nesting:** Card content should use `spacing-4` (1.4rem) internal padding.
*   **Imagery:** Aspect ratios of 4:5 or 16:9 with `rounded-md` corners nested inside the card.

### Buttons
*   **Primary:** Gradient-filled (Primary to Primary-Container). `rounded-full`. High-contrast `on-primary` (#c7ffe5) text.
*   **Secondary:** `surface-container-highest` background. No border.
*   **Tertiary:** Text-only with `primary` color, used for "View All" or "Read More."

### Inputs & Search
*   **Container:** `surface-container-lowest` (#ffffff).
*   **Shape:** `rounded-xl` (3rem) to mimic a search "pill."
*   **Interaction:** On focus, transition the background to `surface-container-high` and add a subtle `primary` ghost border.

### Interactive Chips
*   **Filter Chips:** Use `secondary-container` (#94dffe) with `on-secondary-container` (#005065).
*   **Shape:** `rounded-full`.
*   **Spacing:** Use `spacing-1.5` (0.5rem) between chips.

### Forbid: Divider Lines
Never use `<hr>` or border-bottoms to separate list items. Use **Vertical White Space** (`spacing-6` or `2rem`) or a subtle background toggle between `surface-container-low` and `surface-container-lowest`.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use `rounded-xl` (3rem) for image containers to emphasize the "soft" brand personality.
*   **Do** allow images to overlap the boundaries of their parent containers slightly to create 3D depth.
*   **Do** use `tertiary` (#a23802) sparingly for "Urgency" (e.g., "Only 2 seats left") to provide a warm, sunset-hued contrast to the greens.

### Don't:
*   **Don't** use pure black (#000000) for text. Use `on-surface` (#00362c).
*   **Don't** use sharp corners. Even the smallest component should have at least `rounded-sm` (0.5rem).
*   **Don't** crowd the screen. If a layout feels busy, increase the spacing by one tier in the spacing scale (e.g., move from `spacing-8` to `spacing-10`).
*   **Don't** use standard Material 3 shadows. Always tint shadows with the primary green hue for a "natural light" effect.