import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { TeamPageTemplate } from './TeamPageTemplate';

interface matchParams {
    id: string;
}

interface Props extends RouteComponentProps<matchParams> {}

class TeamPageConnect extends React.Component<Props> {
    render() {
        return <TeamPageTemplate teamId={this.props.match.params.id} />;
    }
}

const TeamPageConnectWithRouter = withRouter(TeamPageConnect);

export { TeamPageConnectWithRouter as TeamPageConnect };
