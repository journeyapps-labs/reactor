import { observable } from 'mobx';
import { v4 } from 'uuid';
import * as React from 'react';
import { AbstractStore } from '../AbstractStore';

export enum AnchoredOverlayPlacement {
  AUTO = 'auto',
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left'
}

export interface AnchoredOverlayBounds {
  top: number;
  left: number;
  width: number;
  height: number;
  right?: number;
  bottom?: number;
}

export interface AnchoredOverlayRenderContext {
  placement: AnchoredOverlayPlacement;
  above: boolean;
}

export interface AnchoredOverlayRecord {
  id: string;
  source: string;
  bounds: AnchoredOverlayBounds;
  placement: AnchoredOverlayPlacement;
  clickThrough: boolean;
  render: (context: AnchoredOverlayRenderContext) => React.ReactNode;
}

export type AnchoredOverlayOptions = Omit<AnchoredOverlayRecord, 'id'> & { id?: string };

export class AnchoredOverlayStore extends AbstractStore {
  @observable
  accessor overlays: Map<string, AnchoredOverlayRecord>;

  constructor() {
    super({ name: 'ANCHORED_OVERLAY_STORE' });
    this.overlays = observable.map<string, AnchoredOverlayRecord>();
  }

  show(options: AnchoredOverlayOptions): string {
    const id = options.id || v4();
    this.overlays.set(id, { ...options, id });
    return id;
  }

  update(id: string, options: Partial<Omit<AnchoredOverlayRecord, 'id'>>) {
    const overlay = this.overlays.get(id);
    if (!overlay) {
      return;
    }
    this.overlays.set(id, { ...overlay, ...options, id });
  }

  hide(id: string) {
    this.overlays.delete(id);
  }

  replaceSource(source: string, records: AnchoredOverlayOptions[]) {
    for (const [id, overlay] of this.overlays.entries()) {
      if (overlay.source === source) {
        this.overlays.delete(id);
      }
    }
    records.forEach((record) => this.show(record));
  }

  clearSource(source: string) {
    this.replaceSource(source, []);
  }

  getOverlays() {
    return Array.from(this.overlays.values());
  }

  hasOverlays() {
    return this.overlays.size > 0;
  }

  isClickThrough() {
    return this.getOverlays().every((overlay) => overlay.clickThrough);
  }
}
