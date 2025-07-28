import { expect, test } from 'vitest';
import { displayDateTime, parseDateTypesToLuxon, ReactorDateFormats, simpleDateTime, toRelative } from '../src/dates';
import { DateTime, Duration } from 'luxon';

test('parse reactor dates', () => {
  let format1 = '2025-06-12T19:02:46.925Z';
  let format2 = new Date('2025-06-12T19:02:46.925Z');
  let format3 = DateTime.fromISO('2025-06-12T19:02:46.925Z');

  let luxon1 = parseDateTypesToLuxon(format1);
  let luxon2 = parseDateTypesToLuxon(format2);
  let luxon3 = parseDateTypesToLuxon(format3);

  expect(luxon1).toBeInstanceOf(DateTime);
  expect(luxon2).toBeInstanceOf(DateTime);
  expect(luxon3).toBeInstanceOf(DateTime);

  expect(luxon1.toUTC().toISO()).toEqual(format1);
  expect(luxon2.toUTC().toISO()).toEqual(format1);
  expect(luxon3.toUTC().toISO()).toEqual(format1);
});

test('format reactor dates using legacy function', () => {
  expect(simpleDateTime('2025-06-12T19:02:46.925Z', true)).toEqual('2025-06-12 15:02:46');
});

test('format reactor dates locally', () => {
  // these should all be 1:02 PM
  expect(
    displayDateTime({
      date: '2025-06-12T19:02:46.925Z',
      local: true,
      format: ReactorDateFormats.SIMPLE,
      _debugLocale: true
    })
  ).toEqual('2025-06-12 15:02:46');

  expect(
    displayDateTime({
      date: '2025-06-12T19:02:46.925Z',
      local: true,
      format: ReactorDateFormats.LOCAL,
      _debugLocale: true
    })
  ).toEqual('6/12/2025, 3:02 PM');

  expect(
    displayDateTime({
      date: '2025-06-12T19:02:46.925Z',
      local: true,
      format: ReactorDateFormats.ISO,
      _debugLocale: true
    })
  ).toEqual('2025-06-12T15:02:46.925-04:00');
});

test('format reactor dates UTC-0', () => {
  expect(
    displayDateTime({
      date: '2025-06-12T19:02:46.925Z',
      local: false,
      format: ReactorDateFormats.SIMPLE
    })
  ).toEqual('2025-06-12 19:02:46');

  expect(
    displayDateTime({
      date: '2025-06-12T19:02:46.925Z',
      local: false,
      format: ReactorDateFormats.LOCAL
    })
  ).toEqual('6/12/2025, 7:02 PM');

  expect(
    displayDateTime({
      date: '2025-06-12T19:02:46.925Z',
      local: false,
      format: ReactorDateFormats.ISO
    })
  ).toEqual('2025-06-12T19:02:46.925Z');
});

test('format reactor dates UTC-0 with zone', () => {
  expect(
    displayDateTime({
      date: '2025-06-12T19:02:46.925Z',
      local: false,
      zone: true,
      format: ReactorDateFormats.SIMPLE
    })
  ).toEqual('2025-06-12 19:02:46 (UTC)');

  expect(
    displayDateTime({
      date: '2025-06-12T19:02:46.925Z',
      local: true,
      zone: true,
      format: ReactorDateFormats.SIMPLE,
      _debugLocale: true
    })
  ).toEqual('2025-06-12 15:02:46 (America/New_York)');
});

test('format reactor dates relative', () => {
  let now = DateTime.now();
  let date = now.minus(Duration.fromObject({ minute: 1 }));
  expect(toRelative(date, now)).toEqual('1 minute ago');
});
