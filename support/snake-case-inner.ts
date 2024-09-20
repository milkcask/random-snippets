/*
the `ToSnake` Generics: Copyright Ross Williams. 2021, Alex @ Thanksbox Ltd. 2022
Lincesed under an Apache License 2.0
NB: This file isn't entirely my work! It's slightly modified from the abandoned npm:ts-case-convert
*/
export type ToSnake<S extends string | number | symbol> = S extends string
    ? S extends `${infer Head}${CapitalChars}${infer Tail}` // string has a capital char somewhere
        ? Head extends "" // there is a capital char in the first position
            ? Tail extends ""
                ? Lowercase<S> /*  'A' */
                : S extends `${infer Caps}${Tail}` // tail exists, has capital characters
                ? Caps extends CapitalChars
                    ? Tail extends CapitalLetters
                        ? `${Lowercase<Caps>}_${Lowercase<Tail>}` /* 'AB' */
                        : Tail extends `${CapitalLetters}${string}`
                        ? `${ToSnake<Caps>}_${ToSnake<Tail>}` /* first tail char is upper? 'ABcd' */
                        : `${ToSnake<Caps>}${ToSnake<Tail>}` /* 'AbCD','AbcD',  */ /* TODO: if tail is only numbers, append without underscore */
                    : never /* never reached, used for inference of caps */
                : never
            : Tail extends "" /* 'aB' 'abCD' 'ABCD' 'AB' */
            ? S extends `${Head}${infer Caps}`
                ? Caps extends CapitalChars
                    ? Head extends Lowercase<Head> /* 'abcD' */
                        ? Caps extends Numbers
                            ? never /* stop union type forming */
                            : `${ToSnake<Head>}_${ToSnake<Caps>}` /* 'abcD' 'abc25' */
                        : never /* stop union type forming */
                    : never
                : never /* never reached, used for inference of caps */
            : S extends `${Head}${infer Caps}${Tail}` /* 'abCd' 'ABCD' 'AbCd' 'ABcD' */
            ? Caps extends CapitalChars
                ? Head extends Lowercase<Head> /* is 'abCd' 'abCD' ? */
                    ? Tail extends CapitalLetters /* is 'abCD' where Caps = 'C' */
                        ? `${ToSnake<Head>}_${ToSnake<Caps>}_${Lowercase<Tail>}` /* aBCD Tail = 'D', Head = 'aB' */
                        : Tail extends `${CapitalLetters}${string}` /* is 'aBCd' where Caps = 'B' */
                        ? Head extends Numbers
                            ? never /* stop union type forming */
                            : Head extends `${string}${Numbers}`
                            ? never /* stop union type forming */
                            : `${Head}_${ToSnake<Caps>}_${ToSnake<Tail>}` /* 'aBCd' => `${'a'}_${Lowercase<'B'>}_${ToSnake<'Cd'>}` */
                        : `${ToSnake<Head>}_${Lowercase<Caps>}${ToSnake<Tail>}` /* 'aBcD' where Caps = 'B' tail starts as lowercase */
                    : never
                : never
            : never
        : S /* 'abc'  */
    : never;

type CapitalLetters =
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "F"
    | "G"
    | "H"
    | "I"
    | "J"
    | "K"
    | "L"
    | "M"
    | "N"
    | "O"
    | "P"
    | "Q"
    | "R"
    | "S"
    | "T"
    | "U"
    | "V"
    | "W"
    | "X"
    | "Y"
    | "Z";

type Numbers = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type CapitalChars = CapitalLetters | Numbers;
