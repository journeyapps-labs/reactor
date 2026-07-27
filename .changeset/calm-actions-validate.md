---
'@journeyapps-labs/reactor-mod': major
---

Simplify action validation and make it event-aware.

- Remove `ActionValidatorContext`, `generateValidationContext()`, and `validatePassively()`.
- Add `Action.validate(event)`, which combines validator results directly and passes the action event to each validator.
- Pass bound event data through button, control, combo-box, curried-action, and execution-preflight validation.
- Replace validation contexts attached to buttons with lightweight validation functions.
- Rename the `DISALLOWED` validation state to `HIDDEN`, reflecting its UI behavior.
- Rename `PassiveActionValidationState` to `ActionValidationState`.
- Add `PENDING` and remediable `BLOCKED` states. Blocked results may provide an `onActivate` callback and a generic visual indicator.
- Ensure direct panel, floating, and toolbar buttons omit themselves when validation returns `HIDDEN`.
- Remove the `representAsButton(extraData, validate)` compatibility flag and the redundant `ActionButtonWidget`; standard button widgets now own validation rendering.
- Evaluate button validation on the initial render and retain one reactive subscription when the validator function changes.
- Align buttons, search fields, and form controls through a shared size-aware control radius while retaining the softer card and surface radius.
- Add modeled placeholders to text, textarea, and number inputs, default placeholders to the input label, and improve Reactor Dark error-text contrast.
- Remove validator busy/listener state, plan-specific disabled reasons, plan notifications, and plan theme values from Reactor.
- Replace `processCallbackWithValidation()` with the generic `activateWithValidation()` helper.
- Consolidate the inline validator classes into an event-aware `InlineActionValidator`.
- Rename the shared tree badge foreground property from `iconColor` to `foreground` so validation indicators and tree badges use the same presentation shape.

Consumers should replace `action.generateValidationContext().validate()` with `action.validate(event)` and `action.validatePassively()` with `action.validate(event).type`.
Plan integrations should return `BLOCKED` with an `onActivate` callback instead of using Reactor plan-specific disabled reasons.
