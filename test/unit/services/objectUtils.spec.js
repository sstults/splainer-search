import { describe, it, expect } from 'vitest';
import { copyObject, mergeObjects, isDefined, isUndefined } from '../../../services/objectUtils.js';

describe('objectUtils', () => {
  describe('copyObject', () => {
    it('should handle null input', () => {
      expect(copyObject(null)).toBe(null);
    });

    it('should handle undefined input', () => {
      expect(copyObject(undefined)).toBe(undefined);
    });

    it('should handle primitive types', () => {
      expect(copyObject(42)).toBe(42);
      expect(copyObject('hello')).toBe('hello');
      expect(copyObject(true)).toBe(true);
      expect(copyObject(false)).toBe(false);
    });

    it('should handle Date objects', () => {
      const date = new Date('2023-01-01');
      const copied = copyObject(date);
      expect(copied).toEqual(date);
      expect(copied).not.toBe(date);
    });

    it('should deep copy arrays', () => {
      const original = [1, 2, 3];
      const copied = copyObject(original);
      expect(copied).toEqual(original);
      expect(copied).not.toBe(original);
    });

    it('should deep copy nested objects', () => {
      const original = {
        a: 1,
        b: {
          c: 2,
          d: [3, 4]
        }
      };
      const copied = copyObject(original);
      expect(copied).toEqual(original);
      expect(copied).not.toBe(original);
      expect(copied.b).not.toBe(original.b);
      expect(copied.b.d).not.toBe(original.b.d);
    });

  });

  describe('mergeObjects', () => {
    it('should return target when no sources provided', () => {
      const target = { a: 1 };
      const result = mergeObjects(target);
      expect(result).toBe(target);
    });

    it('should handle null target', () => {
      const result = mergeObjects(null, { a: 1 });
      expect(result).toBe(null);
    });

    it('should handle primitive target', () => {
      const result = mergeObjects(42, { a: 1 });
      expect(result).toBe(42);
    });

    it('should merge two objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = mergeObjects(target, source);
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should deeply merge nested objects', () => {
      const target = { a: 1, b: { c: 2, d: 3 } };
      const source = { b: { c: 4, e: 5 }, f: 6 };
      const result = mergeObjects(target, source);
      expect(result).toEqual({ a: 1, b: { c: 4, d: 3, e: 5 }, f: 6 });
    });

    it('should handle array merging', () => {
      const target = { a: [1, 2] };
      const source = { a: [3, 4] };
      const result = mergeObjects(target, source);
      expect(result).toEqual({ a: [3, 4] });
    });

    it('should handle null sources', () => {
      const target = { a: 1 };
      const result = mergeObjects(target, null, { b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle undefined sources', () => {
      const target = { a: 1 };
      const result = mergeObjects(target, undefined, { b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined({})).toBe(true);
      expect(isDefined([])).toBe(true);
    });

    it('should return false for null and undefined', () => {
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe('isUndefined', () => {
    it('should return true for null and undefined', () => {
      expect(isUndefined(null)).toBe(true);
      expect(isUndefined(undefined)).toBe(true);
    });

    it('should return false for defined values', () => {
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined('')).toBe(false);
      expect(isUndefined(false)).toBe(false);
      expect(isUndefined({})).toBe(false);
      expect(isUndefined([])).toBe(false);
    });
  });
});
