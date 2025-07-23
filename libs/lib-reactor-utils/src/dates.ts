import * as _ from 'lodash';
import { DateTime } from 'luxon';

export type ReactorDateType = Date | DateTime | string;

export const parseDateTypesToLuxon = (date: ReactorDateType) => {
  if (_.isString(date)) {
    return DateTime.fromISO(date);
  }
  if (DateTime.isDateTime(date)) {
    return date;
  }
  if (date instanceof Date) {
    return DateTime.fromJSDate(date);
  }
  throw new Error('Invalid date type');
};

/**
 * Takes any date as accepted by new Date(x) where x is the date
 * and returns the date as a string in the format yyyy-mm-dd hh:mm:ss
 *
 * @deprecated use displayDateTime instead
 */
export const simpleDateTime = (date: ReactorDateType, _debugLocale: boolean = false) => {
  return displayDateTime({
    format: ReactorDateFormats.SIMPLE,
    local: true,
    date,
    _debugLocale
  });
};

export enum ReactorDateFormats {
  /**
   * @example 2025-06-12 13:02:46
   */
  SIMPLE = 'simple',
  /**
   * @example 2025-06-12T19:02:46.925Z
   */
  ISO = 'iso',
  /**
   * 6/12/2025, 7:02 PM
   */
  LOCAL = 'local'
}

export interface ComputeDateTimePartsOptions {
  date: ReactorDateType;
  local: boolean;
  format: ReactorDateFormats;
  _debugLocale?: boolean;
}

export const computeDateTimeParts = (options: ComputeDateTimePartsOptions) => {
  const { date, local, format, _debugLocale } = options;
  let object = parseDateTypesToLuxon(date);
  if (local) {
    object = object.toLocal();
    if (_debugLocale) {
      object = object.setLocale('en-US');
      object = object.setZone('America/New_York');
    }
  } else {
    object = object.toUTC();
  }

  let display_time = object.toFormat('HH:mm:ss');
  let display_date = object.toISODate();
  let display = `${display_date} ${display_time}`;

  if (format === ReactorDateFormats.ISO) {
    display = object.toISO();
  } else if (format === ReactorDateFormats.LOCAL) {
    display = object.toLocaleString(DateTime.DATETIME_SHORT).replace('\u202f', ' ');
    display_date = object.toLocaleString(DateTime.DATE_SHORT);
    display_time = object.toLocaleString(DateTime.DATETIME_SHORT);
  }

  return {
    display: display,
    display_time,
    display_date,
    zone: object.zoneName,
    datetime: object
  };
};

export const displayDateTime = (options: ComputeDateTimePartsOptions & { zone?: boolean }) => {
  let { display, zone } = computeDateTimeParts(options);
  if (options.zone) {
    return `${display} (${zone})`;
  }
  return display;
};

export const toRelative = (date: ReactorDateType, now?: ReactorDateType) => {
  let time = parseDateTypesToLuxon(date);
  return time.toRelative({ base: now ? parseDateTypesToLuxon(now) : undefined });
};
