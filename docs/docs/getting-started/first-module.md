---
sidebar_position: 4
title: Build your first module
---

# Build your first module

This walkthrough adds a small panel to the demo application. It introduces the four pieces most Reactor features begin with: a module, a store, a panel, and a workspace.

Create `demo/module-hello` using the package, TypeScript, and `reactor.config.json` files in `demo/module-todos` as a template. Set the config slug to `module-hello`. The demo launcher discovers every `demo/module-*` directory containing a Reactor config.

## 1. Create a store

Stores own observable application state and services:

```ts title="src/HelloStore.ts"
import { AbstractStore } from '@journeyapps-labs/reactor-mod';
import { observable } from 'mobx';

export class HelloStore extends AbstractStore {
  @observable accessor visits = 0;

  constructor() {
    super({ name: 'HELLO_STORE' });
  }

  visit() {
    this.visits += 1;
    this.logger.info('Hello panel visited', { visits: this.visits });
  }
}
```

Constructors establish usable initial state. Override `_init()` only when the store has asynchronous boot work.

## 2. Create a panel

A panel model represents serializable workspace state. Its factory describes how Reactor creates and renders it.

```tsx title="src/HelloPanel.tsx"
import React from 'react';
import { observer } from 'mobx-react';
import { WorkspaceModelFactoryEvent } from '@projectstorm/react-workspaces-core';
import {
  CardWidget,
  ioc,
  PanelButtonWidget,
  ReactorPanelFactory,
  ReactorPanelModel
} from '@journeyapps-labs/reactor-mod';
import { HelloStore } from './HelloStore';

export class HelloPanelModel extends ReactorPanelModel {
  constructor() {
    super('hello.panel');
    this.setExpand(true, true);
  }
}

const HelloPanelWidget = observer(() => {
  const store = ioc.get(HelloStore);
  return (
    <CardWidget
      title="Hello Reactor"
      subHeading={`Visits: ${store.visits}`}
      sections={[
        {
          key: 'hello',
          content: () => <PanelButtonWidget label="Visit" icon="hand" action={() => store.visit()} />
        }
      ]}
    />
  );
});

export class HelloPanelFactory extends ReactorPanelFactory<HelloPanelModel> {
  constructor() {
    super({
      type: 'hello.panel',
      name: 'Hello',
      icon: 'hand',
      category: 'Examples',
      isMultiple: false,
      padding: true
    });
  }

  protected generatePanelContent(_event: WorkspaceModelFactoryEvent<HelloPanelModel>) {
    return <HelloPanelWidget />;
  }

  protected _generateModel() {
    return new HelloPanelModel();
  }
}
```

## 3. Install the feature from a module

```ts title="src/HelloModule.ts"
import {
  AbstractReactorModule,
  ReactorModuleInitEvent,
  ReactorModuleRegisterEvent,
  WorkspaceModel,
  WorkspaceStore
} from '@journeyapps-labs/reactor-mod';
import { HelloStore } from './HelloStore';
import { HelloPanelFactory } from './HelloPanel';

export class HelloModule extends AbstractReactorModule {
  constructor() {
    super({ name: 'Hello module' });
  }

  register(event: ReactorModuleRegisterEvent) {
    const workspaceStore = event.ioc.get(WorkspaceStore);
    const panelFactory = new HelloPanelFactory();

    event.registerStore(HelloStore, new HelloStore());
    workspaceStore.registerFactory(panelFactory);
    workspaceStore.registerWorkspaceGenerator({
      generateWorkspace: async () => {
        const root = workspaceStore.generateRootModel();
        root.addModel(panelFactory.generateModel());
        return new WorkspaceModel({ id: 'hello', name: 'Hello', model: root });
      }
    });
  }

  async init(_event: ReactorModuleInitEvent) {}
}
```

Export the module as the package default from `src/index.ts`:

```ts
import { HelloModule } from './HelloModule';
export default HelloModule;
```

## 4. Run it

Restart `pnpm demo:watch`, select the new module, and open the Hello workspace.

You now have the basic Reactor composition:

- the **module** installs the feature;
- the **store** owns its state;
- the **panel factory** makes the feature renderable;
- the **workspace generator** gives the panel a home.

The next subsystem guides explain how to replace the inline button callback with an Action and how Entity Definitions let generic Reactor surfaces understand application models.
