---
title: Controls
description: Adapt values and behavior to buttons, widgets, combo boxes, settings, and forms.
---

# Controls

Controls are Reactor's adaptation layer. A control owns one behavior or value and knows how to represent it on the different surfaces where an application needs it. Actions, settings, and forms build on this contract rather than inventing separate buttons, selectors, and menus.

## Controls

`AbstractControl` defines three representations:

```ts
abstract representAsBtn(): Btn;
abstract representAsControl(options?: RepresentAsControlOptions): React.JSX.Element;
abstract representAsComboBoxItems(options?: RepresentAsComboBoxItemsEvent): ComboBoxItem[];
```

This lets a Boolean, date, entity selector, set selector, or action participate in a panel, floating menu, and combo box without duplicating its state transitions.

Common controls include:

- `BooleanControl`
- `SetControl`
- `DateControl`
- `EntityControl`
- `FileControl`
- `ButtonControl`
- `ActionButtonControl`

`AbstractValueControl` owns a mutable value and emits value-change events. Its renderers are projections of the same control, not independent widgets.

```ts
const status = new SetControl({
  initialValue: 'review',
  options: [
    { key: 'draft', label: 'Draft' },
    { key: 'review', label: 'In review' },
    { key: 'done', label: 'Done' }
  ]
});

status.registerListener({
  valueChanged: (value) => saveStatus(value)
});
```

The same instance can render as a selector in a panel, supply a button descriptor to another widget, or generate items for a combo box.

## Action controls

`ActionButtonControl` adapts an event-bound action. The control asks the action for its current button descriptor, so its label, icon, validator, indicator, and activation callback remain consistent.

```ts
const control = action.representAsControl({
  eventData: { targetEntity: project }
});
```

The Actions sandbox shows the same action rendered through standard button, icon-only, panel-sized control, compact control, and combo-box item representations.

## Controls as a framework boundary

Prefer accepting an `AbstractControl` when a subsystem needs configurable behavior without caring about its concrete UI. The consumer can ask for the appropriate representation:

```tsx
function ToolbarValue({ control }: { control: AbstractControl }) {
  return control.representAsControl({ size: LayoutContextSize.SMALL });
}
```

This is why controls are used by settings, form inputs, entity selection, action representations, and presenter configuration. The surrounding system owns layout; the control owns the interaction.

## Implementing a control

Implement all three representations even if one is the primary surface. `representAsBtn()` should return a descriptor and not render React itself. `representAsControl()` selects the standard Reactor widget for the current context. `representAsComboBoxItems()` exposes equivalent choices or activation behavior to menus.

Keep state and callbacks in the control. Do not make each representation maintain its own selection state. For value controls, update `value` so registered listeners and every active representation observe the same change.

## Controls in forms and settings

`ControlInput` embeds a control in a form. `AbstractUserSetting` embeds one in the settings system. Both preserve the control as the source of interaction state while adding their own concerns:

- forms add labels, validation, visibility, and submission values;
- settings add stable keys, defaults, persistence, categories, and readiness.

See [Forms](./forms.md) for input modeling and [Settings and persistence](./settings-and-persistence.md) for persisted controls.
