import { ContentBlock } from 'foo';
import { STANDARD_CHAR_RANGES, JOINERS } from "./support/standardCharRanges";
import { FindWithRegexCb } from "./support/mention-types";

const MENTION_PATTERN_HEAD = `( |^)@((?:[${JOINERS}]?[${STANDARD_CHAR_RANGES}]+[${JOINERS}]?)+)`;
const MENTION_PATTERN_REST = `( (?! )(?:[${JOINERS}]?[${STANDARD_CHAR_RANGES}]*)*)?`;
const MAX_NAMES = 6;

export const MENTION_PATTERN = new RegExp(
    `${MENTION_PATTERN_HEAD}${MENTION_PATTERN_REST.repeat(MAX_NAMES - 1)}`,
    "g"
);

export function findInNonEntityText(
    text: string,
    nonEntityStart: number,
    callback: FindWithRegexCb
): void {
    Array.from(text.matchAll(MENTION_PATTERN), (match) => {
        const matchIndex = match.index as number;

        const [{ length }, { length: whitespacesLength }] = match;
        const decoratorStart = nonEntityStart + matchIndex + whitespacesLength;
        const decoratorEnd = nonEntityStart + matchIndex + length;

        callback(decoratorStart, decoratorEnd);
    });
}

const findInContentBlock = (contentBlock: ContentBlock, callback: FindWithRegexCb): void => {
    const contentBlockText = contentBlock.getText();

    // exclude entities, when matching
    contentBlock.findEntityRanges(
        (character) => !character.getEntity(),
        (nonEntityStart, nonEntityEnd) => {
            const text = contentBlockText.slice(nonEntityStart, nonEntityEnd);

            findInNonEntityText(text, nonEntityStart, callback);
        }
    );
};

const mentionCandidateStrategy = (contentBlock: ContentBlock, callback: FindWithRegexCb) => {
    findInContentBlock(contentBlock, callback);
};

export default mentionCandidateStrategy;
