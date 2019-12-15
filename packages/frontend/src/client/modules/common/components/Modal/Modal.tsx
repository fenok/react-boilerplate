import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import ResponsiveModal from 'react-responsive-modal';
import { createGlobalStyle } from 'styled-components';
import { CommonProps } from '../../types/CommonProps';

interface Props extends ExtractProps<typeof ResponsiveModal>, CommonProps {}

const Modal: React.FC<Props> = props => (
    <>
        <ResponsiveModalGlobalStyle />
        <ResponsiveModal {...props} classNames={{ overlay: 'responsive-modal-overlay' }} />
    </>
);

const ResponsiveModalGlobalStyle = createGlobalStyle`
    .responsive-modal-overlay {
        -webkit-overflow-scrolling: touch;
    }
`;

export { Modal, Props };
