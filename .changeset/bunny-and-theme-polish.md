---
"@journeyapps-labs/reactor-mod": minor
"@journeyapps-labs/reactor-mod-editor": patch
---

Expanded and refined built-in theming across Reactor and Editor modules.

- Added a new built-in core theme: `Bunny` (purple-forward), including registration, module wiring, and exports.
- Refined core dark-theme polish for `Reactor` and `JourneyApps` to improve surface hierarchy, readability, card/table integration, and accent consistency.
- Continued `Reactor Light` comfort pass with better separator clarity, softened contrast, and improved metadata/tag readability.
- Tuned card metadata/tag chip styling to be more theme-aware and less visually harsh across light/dark themes.
- Made card selection emphasis theme-specific across built-ins so selected states follow each theme accent language (for example Scarlet red, Journey orange, Bunny purple) instead of a shared blue treatment.
- Improved selected tree-row background consistency across built-in themes, including Reactor-specific behavior where selection fill should remain subtle/neutral.
- Refined panel/search icon contrast in light mode (including search-history affordances and tray glyph balance) for clearer visibility without reintroducing harsh saturation.
- Polished status-card presentation in Reactor-family themes with better surface/background pairing and clearer border separation.
- Improved table row striping behavior so even/odd row backgrounds are consistently rendered and easier to scan.
- Reduced divider/separator intensity on key cards and settings surfaces so section boundaries read clearly without overpowering content.
- Added safer theme-fragment resolution fallback logic to avoid hard runtime failures when a fragment lacks a requested theme key.
- Added editor theme coupling for `Bunny` and guarded editor theme sync paths to avoid undefined selection/serialization regressions.
