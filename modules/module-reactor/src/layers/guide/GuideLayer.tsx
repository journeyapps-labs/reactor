import { AnchoredOverlayLayer } from '../overlay/AnchoredOverlayLayer';

/**
 * Backwards-compatible guide layer name. Guide overlays are now rendered by
 * the shared anchored overlay layer.
 */
export class GuideLayer extends AnchoredOverlayLayer {}
