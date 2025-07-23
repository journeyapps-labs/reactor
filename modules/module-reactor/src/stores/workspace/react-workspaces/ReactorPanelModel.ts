import { autorun, IReactionDisposer, observable, toJS, when } from 'mobx';
import {
  SerializedModel,
  WorkspaceEngineInterface,
  WorkspaceModel,
  WorkspaceModelListener
} from '@projectstorm/react-workspaces-core';
import * as _ from 'lodash';
import { ioc, inject } from '../../../inversify.config';
import { WorkspaceStore } from '../WorkspaceStore';
import { System } from '../../../core/System';

export class ReactorPanelModel<L extends WorkspaceModelListener = WorkspaceModelListener> extends WorkspaceModel<
  SerializedModel,
  L
> {
  @observable
  accessor grabAttention: boolean;

  @observable
  protected accessor deserializing: boolean;

  private _previousToArray: any;
  private _autorun: IReactionDisposer;

  @inject(System)
  private accessor system: System;

  constructor(type: string) {
    super(type);
    this.grabAttention = false;
    this.deserializing = false;
    this.minimumSize.update({
      width: 240
    });

    // @ts-ignore
    this.registerListener({
      visibilityChanged: () => {
        if (this.r_visible && !this._autorun) {
          this._autorun = autorun(
            () => {
              try {
                const serialized = toJS(this.toArray());
                if (!_.isEqual(serialized, this._previousToArray)) {
                  this._previousToArray = serialized;
                  this.triggerSerialize();
                }
              } catch (ex) {
                console.warn(`issue serializing panel: ${this.type}`, ex);
              }
            },
            { name: `PANEL:${type}:serializer` }
          );
        } else if (!this.r_visible && this._autorun) {
          this._autorun();
          this._autorun = null;
        }
      }
    });
  }

  encodeEntities() {
    return {};
  }

  decodeEntities(entities: ReturnType<this['encodeEntities']>) {}

  toArray() {
    return {
      ...super.toArray(),
      _encoded: _.mapValues(this.encodeEntities(), (e) => {
        if (e == null) {
          return null;
        }
        return this.system.encodeEntity(e);
      })
    };
  }

  protected triggerSerialize() {
    ioc.get<WorkspaceStore>(WorkspaceStore).saveWorkspaceDebounced();
  }

  async waitForDeserializeToComplete() {
    if (this.deserializing) {
      return when(() => {
        return this.deserializing === false;
      });
    }
  }

  fromArray(payload: ReturnType<this['toArray']>, engine: WorkspaceEngineInterface) {
    this._previousToArray = payload;
    this.deserializing = true;
    super.fromArray(payload, engine);

    if (payload._encoded) {
      Promise.all(
        Object.keys(payload._encoded).map((k) => {
          if (payload._encoded[k] == null) {
            return [k, null];
          }
          return this.system.decodeEntity(payload._encoded[k]).then((r) => {
            return [k, r];
          });
        })
      )
        .then((results) => {
          this.decodeEntities(
            results.reduce((prev, cur: [string, any]) => {
              prev[cur[0]] = cur[1];
              return prev;
            }, {}) as any
          );
        })
        .finally(() => {
          this.deserializing = false;
        });
    } else {
      this.deserializing = false;
    }
  }

  isSerializable() {
    return true;
  }
}
