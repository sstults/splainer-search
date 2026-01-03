'use strict';

import { beforeEach, describe, expect, it } from 'vitest';
import { vectorSvc } from '../../src/services/vectorSvc.js';

describe('Service: vectorSvc', function () {
  let vectorSvcInstance = null;

  beforeEach(() => {
    vectorSvcInstance = new vectorSvc();
  });

  it('sets and gets', function() {
    var vec = vectorSvcInstance.create();
    vec.set('cat', 5);
    expect(vec.get('cat')).toEqual(5);
  });

  it('converts to string', function() {
    var vec = vectorSvcInstance.create();
    vec.set('cat', 5);
    expect(vec.toStr()).toContain('cat');
    expect(vec.toStr()).toContain('5');
  });

  it('adds vectors', function() {
    var vec = vectorSvcInstance.create();
    vec.set('cat', 5);
  });
  
  it('toStr updates after set', function() {
    var vec1 = vectorSvcInstance.create();
    vec1.set('cat', 5);
    var vec2 = vectorSvcInstance.create();
    vec2.set('dog', 7);
    var vec3 = vectorSvcInstance.add(vec1, vec2);
    expect(vec3.get('cat')).toEqual(5);
    expect(vec3.get('dog')).toEqual(7);
  });
});
