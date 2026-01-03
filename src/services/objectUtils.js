'use strict';

/**
 * Deep copy an object using JSON.parse and JSON.stringify
 * @param {Object} obj - The object to copy
 * @returns {Object} A deep copy of the object
 */
export function copyObject(obj) {
  // Handle null, undefined, and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // Handle Array
  if (obj instanceof Array) {
    return obj.map(item => copyObject(item));
  }
  
  // Handle Object
  if (obj instanceof Object) {
    const copiedObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copiedObj[key] = copyObject(obj[key]);
      }
    }
    return copiedObj;
  }
  
  return obj;
}

/**
 * Deep merge two objects
 * @param {Object} target - The target object to merge into
 * @param {...Object} sources - The source objects to merge from
 * @returns {Object} The merged object
 */
export function mergeObjects(target, ...sources) {
  if (!sources.length) return target;
  if (target === null || typeof target !== 'object') return target;
  
  const result = { ...target };
  
  for (const source of sources) {
    if (source === null || typeof source !== 'object') continue;
    
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = mergeObjects(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
  }
  
  return result;
}

/**
 * Check if a value is defined (not null or undefined)
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is defined
 */
export function isDefined(value) {
  return value !== undefined && value !== null;
}

/**
 * Check if a value is undefined or null
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is undefined or null
 */
export function isUndefined(value) {
  return value === undefined || value === null;
}
