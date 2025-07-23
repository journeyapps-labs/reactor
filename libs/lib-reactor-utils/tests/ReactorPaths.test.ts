import { expect, test } from 'vitest';
import { ReactorPath } from '../src/ReactorPath';

test('normalizing', () => {
  expect(ReactorPath.normalize('/a/b/c//d/')).toEqual('a/b/c/d');
  expect(ReactorPath.normalize('/')).toEqual('');
  expect(ReactorPath.normalize('/a')).toEqual('a');
  expect(ReactorPath.normalize('..')).toEqual('..');
  expect(ReactorPath.normalize('.')).toEqual('.');
});

test('parts', () => {
  expect(ReactorPath.split('/a/b/c//d/')).toEqual(['a', 'b', 'c', 'd']);
  expect(ReactorPath.split('/a/')).toEqual(['a']);
  expect(ReactorPath.split('/')).toEqual([]);
});

test('join', () => {
  expect(ReactorPath.join(...['a', 'b', 'c', 'd'])).toBe('a/b/c/d');
  expect(ReactorPath.join(...['', '', 'a', 'b', 'c', 'd'])).toBe('a/b/c/d');
  expect(ReactorPath.join(...['/a', 'b', '//c', 'd'])).toBe('a/b/c/d');
  expect(ReactorPath.join(...['/', 'b', '//c', 'd/'])).toBe('b/c/d');
  expect(ReactorPath.join(...['/'])).toBe('');
});

test('equals', () => {
  expect(ReactorPath.equals('a/b/c/d', '/a/b/c/d', '/a/b/c///d/')).toEqual(true);
  expect(ReactorPath.equals('a/b/c/d', '/a/b/c/e')).toEqual(false);
});

test('matches', () => {
  expect(ReactorPath.matches('mobile/views/test1/view1.ts', 'mobile/views/**/*.ts')).toEqual(true);
  expect(ReactorPath.matches('mobile/views/test1/view1.ts', 'mobile/views/*.ts')).toEqual(false);
  expect(ReactorPath.matches('mobile/views/view1.ts', 'mobile/views/**/*.ts')).toEqual(true);
  expect(ReactorPath.matches('mobile/views/test1/view1.js', 'mobile/views/**/*.ts')).toEqual(false);
});
