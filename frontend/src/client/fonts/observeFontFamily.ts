import FontFaceObserver from 'fontfaceobserver';
import { IsomorphicStore } from '../IsomorphicStore';
import { fontLoad } from '../modules/common/store/actions';
import { FontFamily, fontFamilyConfig } from './fontFamilyConfig';

function observeFontFamily(fontFamily: FontFamily) {
    Promise.all(
        fontFamilyConfig[fontFamily].variants.map(variant =>
            new FontFaceObserver(fontFamily, variant).load(fontFamilyConfig[fontFamily].testString, 60000),
        ),
    )
        .then(() => IsomorphicStore.getStore({ ssrMode: false }).dispatch(fontLoad(fontFamily)))
        .catch(() =>
            console.warn(`All font variants of \'${fontFamily}\' are not available after 1 minute. Giving up...`),
        );
}

export { observeFontFamily };
