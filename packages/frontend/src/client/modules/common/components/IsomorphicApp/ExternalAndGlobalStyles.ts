import minireset from 'minireset.css';
import normalize from 'normalize.css';
import reactResponsiveModalStyles from 'react-responsive-modal/src/styles.css';
import reset from 'reset-css';
import { createGlobalStyle, css } from 'styled-components';
import { fontFamily, FontFamily } from '../../lib/fonts';
import { MIN_WIDTH } from '../../lib/media';

const globalCss = css`
    /* Enabling 100% page min-height */
    html,
    body {
        height: 100%;
    }

    #root {
        /* Enables sticky footer on IE11 */
        position: relative;
        min-height: 100%;
    }

    body {
        /* Scale on small widths */
        min-width: ${MIN_WIDTH}px;

        /* There must be default font */
        ${fontFamily(FontFamily.BITTER)};

        /* Important for iOS overscroll. May be redefined for concrete Page via props */
        background-color: #ebede8;
    }

    /* Define design-friendly outline color (in the name of a11y) */
    * {
        outline-color: #000000;
    }
`;

/* TODO: combine normalize, reset and minireset to single optimized file */
const ExternalAndGlobalStyles = createGlobalStyle`
    /* stylelint-disable max-empty-lines */
    ${normalize};
    ${reset};
    ${minireset};
    ${reactResponsiveModalStyles};
    ${globalCss};
`;

export { ExternalAndGlobalStyles };
