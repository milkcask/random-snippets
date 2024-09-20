import { OrderedSet } from 'immutable';
import { last } from 'lodash';
import { Mowdown } from 'foo';
import { Style } from './support/style';

type StyleOpenEnd = {
  [key in Style]: { open: string; end: string };
}

const MARKDOWN_OPEN_END: StyleOpenEnd = {
  [Style.Bold]: { open: "**", end: "**" },
  [Style.Italic]: { open: "*", end: "*" },
  [Style.Strikethrough]: { open: "~~", end: "~~" },
  [Style.Underline]: { open: "<u>", end: "</u>" },
};

const HTML_OPEN_END: StyleOpenEnd = {
  [Style.Bold]: { open: "<strong>", end: "</strong>" },
  [Style.Italic]: { open: "<em>", end: "</em>" },
  [Style.Strikethrough]: { open: "<del>", end: "</del>" },
  [Style.Underline]: { open: "<u>", end: "</u>" },
};

const WHITESPACE = " ";
const EMPTY_SET: OrderedSet<Style> = OrderedSet();
const BEGIN = true;
const CONTINUE = true;
const END = false;

const checkIntersection = (slidingStyle: OrderedSet<Style>, rangeStyle: OrderedSet<Style>) =>
  slidingStyle.intersect(rangeStyle).count() >= 1;

const resolveCollapsableWhitespace = (
  decoratorStart: number,
  decoratorEnd: number,
  chars: string[][]
): [[number, boolean], [number, boolean]] => [
  last(chars[decoratorStart]) === WHITESPACE
  ? [decoratorStart + 1, true]
  : [decoratorStart, false],
  chars[decoratorEnd - 1][0] === WHITESPACE
  ? [decoratorEnd - 2, true]
  : [decoratorEnd - 1, false],
];

const boldItalicUnderlineStrikethrough = (
  chars: string[][],
  { block }: Mowdown.SerializerFnProps
) => {
  let slidingStyle: OrderedSet<Style> = EMPTY_SET;
  let rangeStyle: OrderedSet<Style> = EMPTY_SET;

  const range = (character) => {
    if (character.getEntity()) {
      slidingStyle = EMPTY_SET;
      return END;
    }
    
    const characterStyle = character.getStyle() as OrderedSet<Style>;
    if (characterStyle.equals(EMPTY_SET)) {
      slidingStyle = EMPTY_SET;
      return END;
    }
    if (characterStyle.equals(rangeStyle)) {
      return CONTINUE;
    }
    
    if (rangeStyle.equals(EMPTY_SET)) {
      rangeStyle = characterStyle;
      return BEGIN;
    }
    
    // default case is rangeStyle and characterStyle are different but both of them are not empty
    return END;
  }

  const callback = (decoratorStart: number, decoratorEnd: number) => {
    const isIntersecting = checkIntersection(slidingStyle, rangeStyle);
    
    const [[start, isStartCollapsed], [end, isEndCollapsed]] = resolveCollapsableWhitespace(
      decoratorStart,
      decoratorEnd,
      chars
    );
    
    const isMarkdownAmbiguous = isIntersecting && !isStartCollapsed;
    const openEnd = isMarkdownAmbiguous ? HTML_OPEN_END : MARKDOWN_OPEN_END; // TODO: explore the use of escape characters rather than HTML
    
    rangeStyle.forEach((style) => {
      chars[start].unshift(openEnd[style!].open);
      chars[end].push(openEnd[style!].end);
    });
    
    if (isEndCollapsed) {
      slidingStyle = EMPTY_SET;
    } else {
      slidingStyle = rangeStyle;
    }
    rangeStyle = EMPTY_SET;
  };
  
  block.findStyleRanges(range, callback);
  
  return chars;
};

export default boldItalicUnderlineStrikethrough;
