'use strict';

/*
 * Basic vector operations used by explain svc
 *
 */
export function vectorSvc() {
  var SparseVector = function() {
    this.vecObj = {};

    var asStr = '';
    var setDirty = function() {
      asStr = '';
    };

    this.set = function(key, value) {
      this.vecObj[key] = value;
      setDirty();
    };

    this.get = function(key) {
      if (Object.hasOwn && Object.hasOwn(this.vecObj, key)) {
        return this.vecObj[key];
      }
      return undefined;
    };

    this.add = function(key, value) {
      if (Object.hasOwn && Object.hasOwn(this.vecObj, key)) {
        this.vecObj[key] += value;
      }
      else {
        this.vecObj[key] = value;
      }
      setDirty();
    };

    this.toStr = function() {
      // memoize the toStr conversion
      if (asStr === '') {
        // sort
        var sortedL = [];
        Object.keys(this.vecObj).forEach(function(key) {
          sortedL.push([key, this.vecObj[key]]);
        }.bind(this));
        sortedL.sort(function(lhs, rhs) {return rhs[1] - lhs[1];});
        sortedL.forEach(function(keyVal) {
          asStr += (keyVal[1] + ' ' + keyVal[0] + '\n');
        });
      }
      return asStr;
    };

  };

  this.create = function() {
    return new SparseVector();
  };

  this.add = function(lhs, rhs) {
    var rVal = this.create();
    Object.keys(lhs.vecObj).forEach(function(key) {
      rVal.set(key, lhs.vecObj[key]);
    });
    Object.keys(rhs.vecObj).forEach(function(key) {
      rVal.set(key, rhs.vecObj[key]);
    });
    return rVal;
  };

  this.sumOf = function(lhs, rhs) {
    var rVal = this.create();
    Object.keys(lhs.vecObj).forEach(function(key) {
      rVal.add(key, lhs.vecObj[key]);
    });
    Object.keys(rhs.vecObj).forEach(function(key) {
      rVal.add(key, rhs.vecObj[key]);
    });
    return rVal;
  };


  this.scale = function(lhs, scalar) {
    var rVal = this.create();
    Object.keys(lhs.vecObj).forEach(function(key) {
      rVal.set(key, lhs.vecObj[key] * scalar);
    });
    return rVal;
  };
}
