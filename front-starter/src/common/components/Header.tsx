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
import gql from 'graphql-tag';
import React, { FC, memo } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import SignOutButton from '../../features/auth/SignOutButton';
import ConnectionStatus from '../../features/pwa/ConnectionStatus';
import { useCache } from '../utils/app.utils';

const useStyles = makeStyles((theme: Theme) => createStyles({
    appBar: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'space-between',
    },
    tabs: {
      flexGrow: 1,
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

const GET_PROFILE = gql`{ profile { name, picture } }`;

const Header: FC = () => {
  const classes = useStyles(); // MUI Styles
  const { pathname } = useLocation();
  const { profile } = useCache(GET_PROFILE);
  const name = profile?.name;
  const picture = profile?.picture;
  return (
    <AppBar position="static" classes={{ root: classes.appBar }} data-testid={'header'}>
      <Tabs value={pathname} classes={{ root: classes.tabs }}>
        {pages.map(p => <LinkTab key={p.path} label={p.label} to={p.path} value={p.path} />)}
      </Tabs>
      <ConnectionStatus />
      <div className={classes.headerElements}>
        {name}
      </div>
      <Avatar src={picture} />
      <SignOutButton className={classes.headerElements} />
    </AppBar>
  );
};

export default memo(Header);
