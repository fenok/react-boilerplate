import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { HeaderTemplate } from './HeaderTemplate';

interface matchParams {
    id: string;
}

interface Props extends RouteComponentProps<matchParams> {}

class HeaderConnect extends React.Component<Props> {
    render() {
        return <HeaderTemplate currentTeamId={this.props.match.params.id} teamIds={['1', '2', '3']} />;
    }
}

const HeaderConnectWithRouter = withRouter(HeaderConnect);

export { HeaderConnectWithRouter as HeaderConnect };
