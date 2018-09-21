import { css, SimpleInterpolation, ThemedCssFunction } from 'styled-components';

/** Sizes are mobile-first */

// Pixels
export enum Size {
    SMALL = 0,
    MEDIUM = 768,
    LARGE = 1024,
    EXTRA_LAGGE = 1440,
}

export interface MediaSizeTemplate {
    small: ThemedCssFunction<any>;
    medium: ThemedCssFunction<any>;
    large: ThemedCssFunction<any>;
}

// TODO: remove any
export const size = Object.keys(Size)
    .map(key => key.toLowerCase())
    .reduce((acc: any, label: any) => {
        acc[label] = (template: TemplateStringsArray, ...args: SimpleInterpolation[]) => css`
            @media (min-width: ${Size[label.toUpperCase()]}px) {
                ${css(template, ...args)};
            }
        `;

        return acc;
    }, {}) as MediaSizeTemplate;

export function getSize(viewportWidth: number): Size {
    if (viewportWidth >= Size.EXTRA_LAGGE) {
        return Size.EXTRA_LAGGE;
    }

    if (viewportWidth >= Size.LARGE) {
        return Size.LARGE;
    }

    if (viewportWidth >= Size.MEDIUM) {
        return Size.MEDIUM;
    }

    return Size.SMALL;
}
