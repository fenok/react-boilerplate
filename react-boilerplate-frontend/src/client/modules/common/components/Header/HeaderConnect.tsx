import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { StoreState } from '../../../../IsomorphicStore';
import { Media } from '../../../common/store/types';

import { HeaderBehaviour } from './HeaderBehaviour';
import { CurrentCommonProps } from './HeaderTemplate';

interface Props extends CurrentCommonProps {
    media: Media;
}

type HeaderConnectProps = Props & RouteComponentProps<{ id: string }>;

class HeaderConnect extends React.Component<HeaderConnectProps> {
    render() {
        return <HeaderBehaviour currentTeamId={this.props.match.params.id} teamIds={['1', '2', '3']} {...this.props} />;
    }
}

function mapStateToProps(state: StoreState): { media: Media } {
    return {
        media: state.common.media,
    };
}

const HeaderConnectWithRouter = withRouter(HeaderConnect);
const HeaderConnectWithStore = connect(mapStateToProps)(HeaderConnectWithRouter);

export { HeaderConnectWithStore as HeaderConnect };
