flat-to-nested
==============

Convert a hierarchy from flat to nested representation.

[![Build Status](https://travis-ci.org/joaonuno/flat-to-nested-js.png)](https://travis-ci.org/joaonuno/flat-to-nested-js)

# Example

```
var FlatToNested, flatToNested, flat;

FlatToNested = require('flat-to-nested');
flatToNested = new FlatToNested( /* can take a config object to use other property names */ );

flat = [
	{id: 111, parent: 11},
	{id: 11, parent: 1},
	{id: 12, parent: 1},
	{id: 1}
];

flatToNested.convert(flat);

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