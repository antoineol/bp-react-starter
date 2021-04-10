import { withAuthenticationRequired } from '@auth0/auth0-react';
import React, { FC, memo } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { Loading } from '../../common/components/Loading';

interface Props extends RouteProps {
  component: FC;
}

export const ProtectedRoute: FC<Props> = memo(({ component, ...args }) => (
  <Route
    component={withAuthenticationRequired(component, {
      onRedirecting: () => <Loading />,
      loginOptions: { redirectMethod: 'replace' },
    })}
    {...args}
  />
));
