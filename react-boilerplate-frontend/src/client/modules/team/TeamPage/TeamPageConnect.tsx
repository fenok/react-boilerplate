import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { CurrentCommnProps, TeamPageTemplate } from './TeamPageTemplate';

interface Props extends CurrentCommnProps {}

type RouteProps = Props & RouteComponentProps<matchParams>;

interface matchParams {
    id: string;
}

class TeamPageConnect extends React.Component<RouteProps> {
    render() {
        return <TeamPageTemplate teamId={this.props.match.params.id} />;
    }
}

const TeamPageConnectWithRouter = withRouter(TeamPageConnect);

export { TeamPageConnectWithRouter as TeamPageConnect };
