import { DateTime } from 'luxon';
import * as _ from 'lodash';

/**
 * If the provided string is longer than the
 * maximum length, the string is returned with an ellipse
 * @param str
 * @param maxLength
 */
export const trimString = (str: string, maxLength: number) => {
  if (str.length <= maxLength) {
    return str;
  }

  return str.substr(0, maxLength - 3) + '...';
};

export const getIntlNumberFormatter = _.memoize((maximumFractionDigits: number = 2) => {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: maximumFractionDigits });
});

export const formatNumber = (number: number, maximumFractionDigits: number = 2) => {
  return getIntlNumberFormatter(maximumFractionDigits).format(number);
};
