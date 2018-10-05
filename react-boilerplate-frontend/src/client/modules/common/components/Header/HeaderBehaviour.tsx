import autobind from 'autobind-decorator';
import React from 'react';

import { Media } from '../../../common/store/types';

import { CurrentCommonProps, HeaderTemplate } from './HeaderTemplate';

interface Props extends CurrentCommonProps {
    currentTeamId?: string;
    teamIds: string[];
    media: Media;
}

interface State {
    openNavigation: boolean;
}

class HeaderBehaviour extends React.Component<Props, State> {
    state = {
        openNavigation: false,
    };

    @autobind
    onOpenerClick() {
        this.setState(({ openNavigation }) => ({ openNavigation: !openNavigation }));
    }

    render() {
        return (
            <HeaderTemplate
                openNavigation={this.state.openNavigation}
                onOpenerClick={this.onOpenerClick}
                {...this.props}
            />
        );
    }
}

export { HeaderBehaviour, Props as HeaderBehaviourProps };
