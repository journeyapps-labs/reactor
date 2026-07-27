import * as React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { observable } from 'mobx';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ActionValidationState, Validator } from '../../src/actions/validators/ActionValidator';
import { useValidator } from '../../src/hooks/useValidator';

describe('useValidator', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it('uses the validator result on the first render', async () => {
    const rendered: ActionValidationState[] = [];
    const validator: Validator = () => ({ type: ActionValidationState.DISABLED });

    const TestWidget = () => {
      const { validationResult } = useValidator({ validator });
      rendered.push(validationResult.type);
      return null;
    };

    await act(async () => root.render(<TestWidget />));

    expect(rendered[0]).toBe(ActionValidationState.DISABLED);
    expect(rendered).not.toContain(ActionValidationState.ALLOWED);
  });

  it('switches validator dependencies without recreating its subscription', async () => {
    const first = observable.box(ActionValidationState.ALLOWED);
    const second = observable.box(ActionValidationState.DISABLED);
    const rendered: ActionValidationState[] = [];
    const firstValidator: Validator = () => ({ type: first.get() });
    const secondValidator: Validator = () => ({ type: second.get() });

    const TestWidget = (props: { validator: Validator }) => {
      const { validationResult } = useValidator(props);
      rendered.push(validationResult.type);
      return null;
    };

    await act(async () => root.render(<TestWidget validator={firstValidator} />));
    await act(async () => root.render(<TestWidget validator={secondValidator} />));
    await act(async () => second.set(ActionValidationState.PENDING));

    expect(rendered.at(-1)).toBe(ActionValidationState.PENDING);

    const renderCount = rendered.length;
    await act(async () => first.set(ActionValidationState.HIDDEN));
    expect(rendered).toHaveLength(renderCount);
  });
});
