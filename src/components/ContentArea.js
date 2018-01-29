import React from 'react';
import { Container } from 'semantic-ui-react';
import AuthRoute from './AuthRoute';
import user from './UserHOC';

class ContentArea extends React.Component {
  render() {
    return <Container>
      { this.props.routes.map((route, index) => {
          return <AuthRoute 
              exact={ route.exact } 
              path={ route.path }
              authenticated={!!this.props.user}
              render={() => <route.component />}
              key={index}
          />
      })}
    </Container>
  }
}

export default user(ContentArea);