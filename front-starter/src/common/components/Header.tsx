import { createStyles, makeStyles, Theme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar/AppBar';
import { ButtonBaseProps } from '@material-ui/core/ButtonBase';
import Tab from '@material-ui/core/Tab/Tab';
import Tabs from '@material-ui/core/Tabs/Tabs';
import React, { FC, memo } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import SignOutButton from '../../views/auth/SignOutButton';

const useStyles = makeStyles((theme: Theme) => createStyles({
    appBar: {
      flexDirection: 'row',
    },
    tabs: {
      flexGrow: 1,
    },
    signOutButton: {
      alignSelf: 'center',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
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

const Header: FC = () => {
  const classes = useStyles(); // MUI Styles
  const { pathname } = useLocation();
  return (
    <AppBar position="static" classes={{ root: classes.appBar }} data-testid={'header'}>
      <Tabs value={pathname} classes={{ root: classes.tabs }}>
        {pages.map(p => <LinkTab key={p.path} label={p.label} to={p.path} value={p.path} />)}
      </Tabs>
      <SignOutButton className={classes.signOutButton} />
    </AppBar>
  );
};

export default memo(Header);
