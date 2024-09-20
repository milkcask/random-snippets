import { last } from 'lodash';
import { boldItalicUnderlineStrikethrough, Mowdown, mention2, mapChars} from 'foo';

const NUMBER_DOT = /^\d+\. /;
const BULLET = "- ";

const makeListItem =
    (prefix: string): Mowdown.SerializerFn =>
    (props) => {
        const { block } = props;

        const chars = mapChars(block);

        return [
            prefix,
            boldItalicUnderlineStrikethrough(mention2(chars, props), props),
            "\n",
        ].flat(2);
    };

const orderedList = makeListItem("1. ");
const unorderedList = makeListItem("- ");

const finaliseOrderedList: (
    previousValue: string[][],
    currentValue: string[],
    currentIndex: number,
    array: string[][]
) => string[][] = (previousValue, currentValue) => {
    const isOngoingList = NUMBER_DOT.test(currentValue[0]);

    const prevItemFirstGroup = last(previousValue)?.[0]?.match(/^(\d+)\. /)?.[1];
    const listIndex = prevItemFirstGroup ? Number(prevItemFirstGroup) + 1 : null;

    if (listIndex && isOngoingList) {
        const [_e1, ...restCurrentValue] = currentValue;
        return [...previousValue, [`${listIndex}. `, ...restCurrentValue]];
    }

    if (listIndex) {
        return [...previousValue, ["\n"], currentValue];
    }

    return [...previousValue, currentValue];
};

const finaliseUnorderedList: (
    previousValue: string[][],
    currentValue: string[],
    currentIndex: number,
    array: string[][]
) => string[][] = (previousValue, currentValue) => {
    const isOngoingList = last(previousValue)?.[0] === BULLET;
    const isItem = currentValue[0] === BULLET;

    if (!isItem && isOngoingList) {
        return [...previousValue, ["\n"], currentValue];
    }

    return [...previousValue, currentValue];
};

export { orderedList, unorderedList, finaliseOrderedList, finaliseUnorderedList };
