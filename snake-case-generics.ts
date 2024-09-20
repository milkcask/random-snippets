import { ToSnake } from './support/snake-case-inner';
import { Temporal } from '@js-temporal/polyfill';

interface TypedArray<T extends number | bigint> extends RelativeIndexable<T> {}

export type KeysToSnake<T extends object | undefined | null> = T extends undefined // end, T is undefined
    ? undefined
    : T extends null // end, T is null
    ? null
    : T extends Array<infer ArrayType> // handle, T is Array
    ? ArrayType extends object
        ? Array<KeysToSnake<ArrayType>> // recurrsion as object is found
        : Array<ArrayType> // end, passthrough as non-object is found
    : T extends TypedArray<infer NumericType> // end, T is TypedArray
    ? TypedArray<NumericType>
    : T extends Temporal.Instant // end, T is Temporal.Instant
    ? Temporal.Instant
    : T extends Date // end, T is Date
    ? Date
    : T extends Buffer // end, T is Buffer
    ? Buffer
    : {
          // handle, T is object
          [K in keyof T as ToSnake<K>]: T[K] extends Array<infer ArrayType> | undefined | null // operative: map through properties, and transform keys
              ? ArrayType extends object
                  ? Array<KeysToSnake<ArrayType>> // recurrsion as object is found
                  : Array<ArrayType> // end, passthrough as non-object is found
              : T[K] extends object | undefined | null // `undefined | null` means recurrsion but it will be returned immediately
              ? KeysToSnake<T[K]> // recurrsion as object is found
              : T[K]; // end, passthrough as non-object is found
      };
