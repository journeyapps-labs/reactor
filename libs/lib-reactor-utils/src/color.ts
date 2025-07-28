// @ts-ignore
import * as hexToRgba from 'hex-to-rgba';
import Color from 'color';
import * as _ from 'lodash';
import * as hexOpacity from 'hex-opacity';

export const asColor = _.memoize((color) => {
  try {
    return new Color(color);
  } catch (ex) {
    return null;
  }
});

export const isColor = _.memoize((color) => {
  if (!color) {
    return false;
  }
  return !!asColor(color);
});

export const normalizeColorToHex = _.memoize((color: string) => {
  if (color.startsWith('#')) {
    return color;
  }
  if (isColor(color)) {
    return asColor(color).hex();
  }
  return colorToHex(color);
});

const _isGradient = (color) => {
  return color.indexOf('linear-gradient') !== -1;
};

export const getTransparentColor = _.memoize(
  (color, transparency) => {
    if (_isGradient(color)) {
      return color;
    }
    return new Color(color).alpha(transparency).toString();
  },
  (a, b) => `${a}${b}`
);

export const getDarkenedColor = _.memoize(
  (color, ratio: number) => {
    if (_isGradient(color)) {
      return color;
    }
    return new Color(color).darken(ratio).toString();
  },
  (a, b) => `${a}${b}`
);

export const getColorWithAlphaOptions = (options: { color: string; alphaValueIfNotPresent: number }) => {
  const color = asColor(options.color);
  if (color.alpha() < 1) {
    return color.toString();
  }
  return getTransparentColor(options.color.toString(), options.alphaValueIfNotPresent);
};

/**
 * #11223344 => rgba(17, 34, 51, 0.27)
 */
export const aHexToRgba = _.memoize((hex: string) => {
  if (!hex) {
    return null;
  }
  return hexToRgba(hex);
});

/**
 * rgba(17, 34, 51, 0.27) => #11223344
 */
export const rgbaToAHex = _.memoize((str) => {
  try {
    let c = new Color(str);
    return hexOpacity.create(c.hex(), c.alpha());
  } catch (ex) {}
  return null;
});

export const colorToHex = _.memoize((str: string): string => {
  if (!str) {
    return null;
  }

  const c = asColor(str);
  if (c) {
    return c.hex();
  }

  const ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = str;
  return rgbaToAHex(ctx.fillStyle) || '';
});

/**
 * same as rgbaToAHex, but can also work with colour names like 'mediumpurple'
 */
export const colorToAHex = _.memoize((str: string): string => {
  if (!str) {
    return null;
  }

  const c = rgbaToAHex(str);
  if (c) {
    return c;
  }

  const ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = str;
  return rgbaToAHex(ctx.fillStyle) || '';
});
