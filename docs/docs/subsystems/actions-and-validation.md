---
title: Actions and validation
description: Model reusable user intent and event-aware action availability.
---

# Actions and validation

Actions describe user intent independently of the widget that activates them. A single action can appear in a panel button, toolbar, combo box, context menu, command palette, or shortcut.

## Define and register an action

```ts
export class CreateTodoAction extends Action {
  static ID = 'CREATE_TODO';

  constructor() {
    super({
      id: CreateTodoAction.ID,
      name: 'Create todo',
      icon: 'plus'
    });
  }

  protected async fireEvent(event: ActionEvent) {
    event.getStatus().pushMessage('Creating a todo');
    // perform the operation
  }
}
```

Register it during module registration:

```ts
ioc.get(ActionStore).registerAction(new CreateTodoAction());
```

Registered actions inherit the `ActionStore` logger and receive their own child logger.

## Represent an action

Actions generate descriptors that Reactor widgets consume:

```tsx
<PanelButtonWidget {...action.representAsButton({ todo })} />
```

Other representations include `representAsIcon()`, `representAsControl()`, and `representAsComboBoxItem()`. The event data supplied to the representation is also supplied to validation and execution.

## Validation states

An `ActionValidator` returns one of these states:

- `ALLOWED` — render and execute normally.
- `PENDING` — an asynchronous decision has not completed.
- `DISABLED` — render disabled, optionally with a reason.
- `BLOCKED` — prevent execution but allow a remediation flow.
- `HIDDEN` — omit the action from the UI.

```ts
class SubscriptionValidator extends ActionValidator<MyActionEvent> {
  validate(event: Partial<MyActionEvent>): ValidationResult {
    if (!event.featureAvailable) {
      return {
        type: ActionValidationState.BLOCKED,
        message: 'Upgrade to use this feature',
        indicator: {
          icon: 'dollar-sign',
          background: '#00945b',
          foreground: '#fff',
          tooltip: 'Upgrade required'
        },
        onActivate: () => event.openUpgrade?.()
      };
    }
    return { type: ActionValidationState.ALLOWED };
  }
}
```

Reactor understands only generic validation outcomes. Permission systems, subscriptions, and remediation experiences belong to application modules.
