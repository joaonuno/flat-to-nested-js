flat-to-nested
==============

Convert a hierarchy from flat to nested representation.

[![Build Status](https://travis-ci.org/joaonuno/flat-to-nested-js.svg)](https://travis-ci.org/joaonuno/flat-to-nested-js)

## Example

```js
var FlatToNested, flatToNested, flat;

FlatToNested = require('flat-to-nested');
flatToNested = new FlatToNested( /* can take a config object to use other property names */ );

flat = [
	{id: 111, parent: 11},
	{id: 11, parent: 1},
	{id: 12, parent: 1},
	{id: 1}
];

var nested = flatToNested.convert(flat);
console.log(nested);

//	{
//		id: 1,
//		children: [
//			{
//				id: 11,
//				children: [
//					{
//						id: 111
//					}
//				]
//			},
//			{
//				id: 12
//			}
//		]
//	}
```

## Configuration

The constructor accepts an optional object with some or all of these properties:

```js
flatToNested = new FlatToNested({
	// The name of the property with the node id in the flat representation
	id: 'id',
	// The name of the property with the parent node id in the flat representation
	parent: 'parent',
	// The name of the property that will hold the children nodes in the nested representation
	children: 'children'
}});

```

## Contributing

### Setup

Fork this repository and run `npm install` on the project root folder to make sure you have all project dependencies installed.

### Code Linting

Run `npm run lint`

This will check both source and tests for code correctness and style compliance.

### Running Tests

Run `npm test`
