---
title: UI system
description: Use Reactor widgets, sizing, surfaces, forms, tooltips, and overlays.
---

# UI system

Reactor widgets are shared interaction primitives, not just visual components. Buttons understand action validation, tooltips use anchored overlays, cards expose consistent actions and selection, and controls adapt to the current Reactor size.

The foundational interaction contracts have dedicated guides: [Controls](./controls.md), [Forms](./forms.md), and [Themes](./themes.md). This page focuses on composing their rendered widgets into a consistent application interface.

## Responsive sizing

Wrap a subtree in `ReactorSizeProvider` or pass a `size` prop directly:

```tsx
<ReactorSizeProvider size={Size.SMALL}>
  <PanelButtonWidget label="Save" icon="check" action={save} />
</ReactorSizeProvider>
```

Without an explicit value, Reactor uses a viewport-aware default: small on desktop and medium on mobile. Custom styled widgets can consume the same context through `useReactorSize()` and the `size()` helper.

## Surfaces and cards

Use Reactor surfaces and cards instead of recreating borders, backgrounds, spacing, and selected states. They follow the active theme and participate in the responsive sizing system.

## Tooltips and overlays

`ReactorTooltipWidget` and `useAnchoredOverlay()` render through the shared anchored-overlay layer. Overlays remain aligned while their anchor moves, scrolls, or resizes and can be grouped or configured as click-through.

## Forms

Reactor forms are modeled with `FormModel` and `FormInput` subclasses. Text, textarea, and number inputs default their placeholder to the input label when no explicit placeholder is supplied. Use `GroupInput` to compose nested fields and `hideError` when a containing widget owns validation-message rendering.

## Choosing a component

The playground is the fastest way to compare supported widgets and representations:

- **Actions** demonstrates action-to-button/control/combo-box adaptation and validation states.
- **Forms** demonstrates modeled inputs and grouped fields.
- **Cards**, **Surfaces**, **Tabs**, and **Tables** demonstrate layout primitives.
- **Overlays** demonstrates anchored positioning.
- **Guide** demonstrates guided workflows and attention states.

Run it with `pnpm demo:watch` and select Reactor Playground.
