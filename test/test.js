/* global describe, it */

var chai, assert, FlatToNested;
chai = require('chai');
FlatToNested = require('..');
assert = chai.assert;
chai.Assertion.includeStack = true;

describe('flatToNested', function () {
  'use strict';

  describe('using default configuration', function () {
    var flatToNested;

    flatToNested = new FlatToNested();

    it('should convert an empty array to an empty object', function () {
      assert.deepEqual(flatToNested.convert([]), {});
    });

    it('should convert a one element array to an object without children', function () {
      assert.deepEqual(flatToNested.convert([{id: 1, someKey: 'someValue'}]), {id: 1, someKey: 'someValue'});
    });

    it('should convert when the parents come before the children and there is a root', function () {
      var flat, expected, actual;

      flat = [{id: 1}, {id: 11, parent: 1}, {id: 12, parent: 1}, {id: 111, parent: 11}];

      expected = {id: 1, children: [
        {id: 11, children: [
          {id: 111}
        ]},
        {id: 12}
      ]};

      actual = flatToNested.convert(flat);

      assert.deepEqual(actual, expected);
    });

    it('should convert when the parents come after the children and there is a root', function () {
      var flat, expected;

      flat = [{id: 111, parent: 11}, {id: 11, parent: 1}, {id: 12, parent: 1}, {id: 1}];

      expected = {id: 1, children: [
        {id: 11, children: [
          {id: 111}
        ]},
        {id: 12}
      ]};

      assert.deepEqual(flatToNested.convert(flat), expected);
    });

    it('should convert when the parents come before the children and there is no root', function () {
      var flat, expected, actual;

      flat = [{id: 1}, {id: 11, parent: 1}, {id: 12, parent: 1}, {id: 111, parent: 11}, {id: 2}, {id: 21, parent: 2}];

      expected = {
        children: [
          {
            id: 1,
            children: [
              {id: 11, children: [{id: 111}]},
              {id: 12}
            ]
          },
          {
            id: 2,
            children: [{id: 21}]
          }
        ]
      };

      actual = flatToNested.convert(flat);

      assert.deepEqual(actual, expected);
    });

    it('should convert when the parents come after the children and there is no root', function () {
      var flat, expected;

      flat = [{id: 111, parent: 11}, {id: 11, parent: 1}, {id: 12, parent: 1}, {id: 1}, {id: 21, parent: 2}, {id: 2}];

      expected = {
        children: [
          {
            id: 1,
            children: [
              {id: 11, children: [{id: 111}]},
              {id: 12}
            ]
          },
          {
            id: 2,
            children: [{id: 21}]
          }
        ]
      };

      assert.deepEqual(flatToNested.convert(flat), expected);
    });
  });

  describe('using custom configuration', function () {
    var flatToNested;

    flatToNested = new FlatToNested({
      id: 'code',
      parent: 'from',
      children: 'to'
    });

    it('should convert an empty array to an empty object', function () {
      assert.deepEqual(flatToNested.convert([]), {});
    });

    it('should convert a one element array to an object without children', function () {
      assert.deepEqual(flatToNested.convert([{code: 1, someKey: 'someValue'}]), {code: 1, someKey: 'someValue'});
    });

    it('should convert when the parents come before the children and there is a root', function () {
      var flat, expected, actual;

      flat = [{code: 1}, {code: 11, from: 1}, {code: 12, from: 1}, {code: 111, from: 11}];

      expected = {code: 1, to: [
        {code: 11, to: [
          {code: 111}
        ]},
        {code: 12}
      ]};

      actual = flatToNested.convert(flat);

      assert.deepEqual(actual, expected);
    });

    it('should convert when the parents come after the children and there is a root', function () {
      var flat, expected;

      flat = [{code: 111, from: 11}, {code: 11, from: 1}, {code: 12, from: 1}, {code: 1}];

      expected = {code: 1, to: [
        {code: 11, to: [
          {code: 111}
        ]},
        {code: 12}
      ]};

      assert.deepEqual(flatToNested.convert(flat), expected);
    });

    it('should convert when the parents come before the children and there is no root', function () {
      var flat, expected, actual;

      flat = [
        {code: 1},
        {code: 11, from: 1},
        {code: 12, from: 1},
        {code: 111, from: 11},
        {code: 2},
        {code: 21, from: 2}
      ];

      expected = {
        to: [
          {
            code: 1,
            to: [
              {code: 11, to: [{code: 111}]},
              {code: 12}
            ]
          },
          {
            code: 2,
            to: [{code: 21}]
          }
        ]
      };

      actual = flatToNested.convert(flat);

      assert.deepEqual(actual, expected);
    });

    it('should convert when the parents come after the children and there is no root', function () {
      var flat, expected;

      flat = [
        {code: 111, from: 11},
        {code: 11, from: 1},
        {code: 12, from: 1},
        {code: 1},
        {code: 21, from: 2},
        {code: 2}
      ];

      expected = {
        to: [
          {
            code: 1,
            to: [
              {code: 11, to: [{code: 111}]},
              {code: 12}
            ]
          },
          {
            code: 2,
            to: [{code: 21}]
          }
        ]
      };

      assert.deepEqual(flatToNested.convert(flat), expected);
    });
  });
});
