export const MMKV = {
  set: jest.fn(),
  getString: jest.fn(),
  getNumber: jest.fn(),
  getBoolean: jest.fn(),
  contains: jest.fn(),
  delete: jest.fn(),
  clearAll: jest.fn(),
  getAllKeys: jest.fn(() => []),
};

export const createMMKV = jest.fn(() => MMKV);

export const useMMKVString = jest.fn((_key: string) => [undefined, jest.fn()]);
export const useMMKVNumber = jest.fn((_key: string) => [undefined, jest.fn()]);
export const useMMKVBoolean = jest.fn((_key: string) => [undefined, jest.fn()]);
