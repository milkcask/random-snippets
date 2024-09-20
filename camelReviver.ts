import { camelCase } from 'lodash';

function camelReviver(this: any, key: string, value: any) {
  const camelKey = camelCase(key);
  if (key === camelKey) return value;
  this[camelKey] = value;
  return undefined;
}

export default camelReviver;
