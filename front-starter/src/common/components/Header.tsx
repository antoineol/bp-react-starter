import { useAuth0 } from '@auth0/auth0-react';
import {
  AppBar,
  Avatar,
  ButtonBaseProps,
  createStyles,
  makeStyles,
  Tab,
  Tabs,
  Theme,
} from '@material-ui/core';
import React, { FC, memo } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Auth0User } from '../../features/auth/auth.models';
import { SignInButton } from '../../features/auth/SignInButton';
import { SignOutButton } from '../../features/auth/SignOutButton2';
import { Loading } from './Loading';
// import ConnectionStatus from '../../features/pwa/ConnectionStatus';

const useStyles = makeStyles((theme: Theme) => createStyles({
    appBar: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'space-between',
    },
    tabs: {
      flexGrow: 1,
    },
    loader: {
      marginRight: theme.spacing(1),
      overflow: 'hidden',
    },
    headerElements: {
      margin: theme.spacing(1),
    },
  }),
);

interface Page {
  path: string;
  label: string;
}

const pages: Page[] = [
  { path: '/', label: 'Home' },
  { path: '/profile', label: 'Profile' },
];

interface LinkTabProps extends ButtonBaseProps {
  label?: string;
  to?: string;
}

function LinkTab(props: LinkTabProps) {
  return <Tab component={Link}{...(props as any)} />;
}

export const Header: FC = memo(() => {
  const classes = useStyles(); // MUI Styles
  const { pathname } = useLocation();

  return (
    <AppBar position="static" classes={{ root: classes.appBar }} data-testid={'header'}>
      <Tabs value={pathname} classes={{ root: classes.tabs }}>
        {pages.map(p => <LinkTab key={p.path} label={p.label} to={p.path} value={p.path} />)}
      </Tabs>
      {/*<ConnectionStatus />*/}
      <UserAvatar />
      <SignInButton className={classes.headerElements} />
      <SignOutButton className={classes.headerElements} />
    </AppBar>
  );
});


const UserAvatar: FC = memo(() => {
  const classes = useStyles(); // MUI Styles
  const { isLoading, isAuthenticated, user } = useAuth0();
  if (isLoading) return <Loading inline color={'inherit'} className={classes.loader} />;
  if (!isAuthenticated) return null;
  const { name, picture } = user as Auth0User;

  return <>
    <div className={classes.headerElements}>
      {name}
    </div>
    <Avatar src={picture} />
  </>;
});
