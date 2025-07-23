import * as _ from 'lodash';

// Not 100% RFC 5322 compliant, but should match any email addresses in use.
// Source: http://www.regular-expressions.info/email.html
const emailRegEx = new RegExp(
  "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$",
  'i'
);

export function validateEmail(input: string): boolean {
  return emailRegEx.test(input);
}

// i know this doesnt work for all emails, but people with multiple '@' signs in their
// email addresses are wrong
export function getEmailDomain(e: string): string {
  if (!e) {
    return null;
  }
  return _.last(e.split('@')).trim();
}

export function emailDomainsMatch(a: string, b: string): boolean {
  if (!validateEmail(a) || !validateEmail(b)) {
    return false;
  }
  return getEmailDomain(a) === getEmailDomain(b);
}
