module.exports = (function () {
  'use strict';

  var ParentBased = function(config) {
    this.config = config;
    this.roots = [];
    this.temp = {};
    this.pendingChildOf = {};
  }

  ParentBased.prototype.processItem = function(id, el) {
    function initPush(arrayName, obj, toPush) {
      if (obj[arrayName] === undefined) {
        obj[arrayName] = [];
      }
      obj[arrayName].push(toPush);
    }

    function multiInitPush(arrayName, obj, toPushArray) {
      var len;
      len = toPushArray.length;
      if (obj[arrayName] === undefined) {
        obj[arrayName] = [];
      }
      while (len-- > 0) {
        obj[arrayName].push(toPushArray.shift());
      }
    }

    var parent = el[this.config.parent];
    this.temp[id] = el;
    if (parent === undefined || parent === null) {
      // Current object has no parent, so it's a root element.
      this.roots.push(el);
    } else {
      if (this.temp[parent] !== undefined) {
        // Parent is already in temp, adding the current object to its children array.
        initPush(this.config.children, this.temp[parent], el);
      } else {
        // Parent for this object is not yet in temp, adding it to pendingChildOf.
        initPush(parent, this.pendingChildOf, el);
      }
      if (this.config.options.deleteParent) {
        delete el[this.config.parent];
      }
    }
    if (this.pendingChildOf[id] !== undefined) {
      // Current object has children pending for it. Adding these to the object.
      multiInitPush(this.config.children, el, this.pendingChildOf[id]);
    }
  }

  ParentBased.prototype.getRoots = function() {
    var nested;

    if (this.roots.length === 1) {
      nested = this.roots[0];
    } else if (this.roots.length > 1) {
      nested = {};
      nested[this.config.children] = this.roots;
    } else {
      nested = {};
    }
    return nested;
  }

  var ChildrenBased = function(config, roots) {
    this.config = config;
    this.roots = roots;
    this.temp = {};
    this.rootsTemp = {};
    this.pendingChild = {};
  }

  ChildrenBased.prototype.processItem = function(id, el) {
    var children = el[this.config.children],
      i, len, child, childId, pending;

    i = 0;

    this.temp[id] = el;
    this.rootsTemp[id] = el;

    if (children !== undefined && Array.isArray(children)) {
      for (i, len = children.length; i < len; i++) {
        child = children[i];
        if (typeof(child) === "object") {
          childId = child[this.config.id];
        } else {
          childId = child;
        }

        if(this.rootsTemp[childId]) {
          delete this.rootsTemp[childId]
        }

        if (this.temp[childId] !== undefined) {
          // Child is in temp
          children[i] = this.temp[childId];
          delete this.temp[childId];
        } else {
          this.pendingChild[childId] = {
            arr: children,
            pos: i
          }

        }
      }
    }

    if (this.pendingChild[id] !== undefined) {
      pending = this.pendingChild[id];
      pending.arr[pending.pos] = el;
      delete this.pendingChild[id];
      delete this.temp[id];
      delete this.rootsTemp[id];
    }
  }

  ChildrenBased.prototype.getRoots = function() {
    var rootsTemp = this.rootsTemp,
      roots = Object.keys(this.rootsTemp).map(function(key) {
        return rootsTemp[key];
      }), nested;
    if (roots.length === 1) {
      nested = roots[0];
    } else if (roots.length > 1) {
      nested = {};
      nested[this.config.children] = roots;
    } else {
      nested = {};
    }
    return nested;
  }

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
    this.config.options = config.options || { deleteParent: true, childrenBase: false };
  }

  /**
   * Convert a hierarchy from flat to nested representation.
   *
   * @param {array} flat The array with the hierachy flat representation.
   */
  FlatToNested.prototype.convert = function (flat) {
    var i, len, id, flatEl, base;
    i = 0;

    if (this.config.options.childrenBase) {
      base = new ChildrenBased(this.config);
    } else {
      base = new ParentBased(this.config);
    }

    for (i, len = flat.length; i < len; i++) {
      flatEl = flat[i];
      id = flatEl[this.config.id];

      base.processItem(id, flatEl);
    }

    return base.getRoots();
  };

  return FlatToNested;
})();
