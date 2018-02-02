export interface KeyValuePair<T> {
  key: string;
  value: T
}

export type KeyValueStringPair = KeyValuePair<string>;

export type KeyValuePairList<T> = KeyValuePair<T>[];
export type KeyValuePairListString = KeyValuePair<string>[];
