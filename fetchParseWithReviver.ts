import camelReviver from './camelReviver';
import GenericV1ApiRequest from 'foo';

export type FetchParseWithReviverOptions = {
    reviver?: Parameters<JSON["parse"]>[1] | null;
    statusHandler?: Record<string, (response: Response) => any | undefined>;
    clientErrorHandler?: (response: Response) => any;
};

/**
 *
 * @param GenericV1ApiRequest
 * @param FetchParseWithReviverOptions optional and it defaults to the `camelReviver`
 * , or use `{reviver: null}` to skip reviver altogether.
 */
const fetchParseWithReviver = async (
    request: GenericV1ApiRequest,
    options?: FetchParseWithReviverOptions
) => {
    const reviver =
        options?.reviver === null
            ? undefined
            : options?.reviver ??
              function inlineFnWithThis(this, key, value) {
                  return camelReviver.call(this, key, value);
              };

    const response = await fetch(request);

    if (options?.statusHandler?.[response.status]) {
        const result = options.statusHandler[response.status](response);
        if (result !== null) return result;
    }

    const text = await response.text();
    const obj = JSON.parse(text, reviver);
    return obj;
};

export default fetchParseWithReviver;
