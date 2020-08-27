// Project:
// Definitions by: Peter Muriuki<https://gitthub.com/p-netm>
// typescript version: 3.8.3

export = FlatToNested;

/**
 * Create a new FlatToNested object.
 *
 * @param config The configuration object.
 */
declare class FlatToNested {
  constructor(config: FlatToNested.Config);

  private config: FlatToNested.Config;

  /**
   * Convert a hierarchy from flat to nested representation.
   *
   * @param flat The array with the hierarchy flat representation.
   */
  convert<T extends object>(flat: T[]): FlatToNested.Nested<T>;
}

declare namespace FlatToNested {
  interface Dictionary<T = any> {
    [key: string]: T;
  }
  interface ConfigOptions {
    deleteParent: boolean;
  }

  interface Config {
    id?: string;
    parent?: string;
    children?: string;
    options?: ConfigOptions;
  }

  interface RecursiveObjectTree<T extends object = {}> {
    [children: string]: RecursiveObjectTree<T> & T;
  }

  type Nested<T extends object> = RecursiveObjectTree<T> & T;
}
