export interface SelectKeyValue {
  key: any;
  value: string;
}

export type AuthStorage = {
  authorization: string;
}

export interface Dictionary<T> {
  [Key: string]: T;
}
