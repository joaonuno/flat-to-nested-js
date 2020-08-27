// Minimum TypeScript Version: 3.5
import FlatToNested = require("flat-to-nested");

const flatToNested = new FlatToNested({});

interface SampleFlatType {
  id: number;
  parent?: number;
}

const sampleFlat: SampleFlatType[] = [
  { id: 111, parent: 11 },
  { id: 11, parent: 1 },
  { id: 12, parent: 1 },
  { id: 1 },
];

// $ExpectType Nested<SampleFlatType>
flatToNested.convert(sampleFlat);

/** all roots */
const sampleAllRootsFlat: SampleFlatType[] = [{ id: 111 }, { id: 11 }];

// $ExpectType Nested<SampleFlatType>
flatToNested.convert(sampleAllRootsFlat);

// $ExpectType never
flatToNested.convert([]);
