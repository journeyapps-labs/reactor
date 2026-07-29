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

## Names, aliases, tags, and behavior

The action name is the canonical label shown throughout Reactor. `aliases` are complete alternative names used only to discover the action in the command palette. `tags` are shorter semantic terms used by command-palette search and entity presenters.

```ts
super({
  id: 'DELETE_TODO',
  name: 'Delete todo item',
  aliases: ['Remove todo item', 'Discard todo item'],
  tags: ['todo', 'cleanup'],
  behavior: ActionMacroBehavior.DELETE,
  icon: 'trash'
});
```

Macro behavior contributes conventional search tags. For example, `DELETE` adds `delete`, `remove`, and `destroy`; `COPY` adds `copy`, `clone`, and `duplicate`. Applications can add domain tags such as `billing`, `project`, or `internal` without changing the visible action name.

Aliases are intentionally not rendered as tags. They are alternate full phrases, while tags describe the action and can be displayed or used for grouping in the Actions entity panel.

## Represent an action

Actions generate descriptors that Reactor widgets consume:

```tsx
<PanelButtonWidget {...action.representAsButton({ todo })} />
```

Other representations include `representAsIcon()`, `representAsControl()`, and `representAsComboBoxItem()`. The event data supplied to the representation is also supplied to validation and execution.

Representations carry the validator with them. Widgets do not need to duplicate permission checks; they render the action's current validation state and subscribe to subsequent validator updates.

## Validation states

An `ActionValidator` returns one of these states:

- `ALLOWED` — render and execute normally.
- `DEFERRED` — validation needs action parameters that have not been resolved yet.
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

## Parameterized actions

`ParameterizedAction` resolves required values before execution. `EntityAction` adds a target entity parameter, while `CoupledAction` adds source and target entities.

```ts
export class ArchiveProjectAction extends EntityAction<Project> {
  constructor() {
    super({
      id: 'ARCHIVE_PROJECT',
      name: 'Archive project',
      target: 'project',
      params: [],
      validators: [new ArchiveProjectValidator()],
      icon: 'box-archive'
    });
  }
}
```

An action launched from a context menu may already have its target. The same action launched from the command palette can ask the entity definition to resolve a target. Candidate entities are validated with the partially resolved event, so unavailable choices can be disabled or omitted before selection.

If a validator cannot decide until parameters are available, return `DEFERRED`. Reactor resolves the remaining parameters and runs validation again before `fireEvent()`. Use `PENDING` only when an asynchronous check has started and the validator expects to notify listeners when its answer changes.

The execution order is:

1. collect or resolve action parameters;
2. run validation against the resolved event;
3. activate remediation for `BLOCKED`, or stop for other non-allowed states;
4. execute `fireEvent()`.

This keeps command palette, entity menus, buttons, and shortcuts consistent even when they begin with different amounts of context.
