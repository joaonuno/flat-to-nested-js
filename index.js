module.exports = (function () {
  'use strict';

  /**
   * Create a new FlatToNested object.
   *
   * @constructor
   * @param {object} config The configuration object.
   */
  function FlatToNested(config) {
    this.config = config = config || {};
    this.config.id = config.id || 'id';
    this.config.parent = config.parent || 'parent';
    this.config.children = config.children || 'children';
    this.config.options = config.options || { deleteParent: true };
  }

  /**
   * Convert a hierarchy from flat to nested representation.
   *
   * @param {array} flat The array with the hierachy flat representation.
   */
  FlatToNested.prototype.convert = function (flat) {
    var i, len, temp, roots, id, parent, nested, pendingChildOf, flatEl;
    i = 0;
    roots = [];
    temp = {};
    pendingChildOf = {};

    for (i, len = flat.length; i < len; i++) {
      flatEl = flat[i];
      id = flatEl[this.config.id];
      parent = flatEl[this.config.parent];
      temp[id] = flatEl;
      if (parent === undefined || parent === null) {
        // Current object has no parent, so it's a root element.
        roots.push(flatEl);
      } else {
        if (temp[parent] !== undefined) {
          // Parent is already in temp, adding the current object to its children array.
          initPush(this.config.children, temp[parent], flatEl);
        } else {
          // Parent for this object is not yet in temp, adding it to pendingChildOf.
          initPush(parent, pendingChildOf, flatEl);
        }
        if (this.config.options.deleteParent) {
          delete flatEl[this.config.parent];
        }
      }
      if (pendingChildOf[id] !== undefined) {
        // Current object has children pending for it. Adding these to the object.
        multiInitPush(this.config.children, flatEl, pendingChildOf[id]);
      }
    }

    if (roots.length === 1) {
      nested = roots[0];
    } else if (roots.length > 1) {
      nested = {};
      nested[this.config.children] = roots;
    } else {
      nested = {};
    }
    return nested;
  };

  function getPushArray(arrayName, obj) {
    if (Array.isArray(arrayName)) {
      return arrayName.reduce(function(accumulator, currentValue, index, arr) {
        if (accumulator[currentValue] === undefined) {
          accumulator[currentValue] = index < arr.length - 1 ? {} : [];
        }

        return accumulator[currentValue];
      }, obj)
    } else {
      if (obj[arrayName] === undefined) {
        obj[arrayName] = [];
      }

      return obj[arrayName];
    }
  }

  function initPush(arrayName, obj, toPush) {
    getPushArray(arrayName, obj).push(toPush);
  }

  function multiInitPush(arrayName, obj, toPushArray) {
    var len, array;
    len = toPushArray.length;
    array = getPushArray(arrayName, obj)
    while (len-- > 0) {
      array.push(toPushArray.shift());
    }
  }

  return FlatToNested;
})();
