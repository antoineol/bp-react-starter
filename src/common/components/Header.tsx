import { createStyles, makeStyles, Theme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar/AppBar';
import { ButtonBaseProps } from '@material-ui/core/ButtonBase';
import Tab from '@material-ui/core/Tab/Tab';
import Tabs from '@material-ui/core/Tabs/Tabs';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SignOutButton from '../../auth/SignOutButton';
import { selectLocation } from '../services/routes.service';

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

function Header() {
  const classes = useStyles(); // MUI Styles
  const pathname = useSelector(selectLocation).get('pathname'); // Redux Selector
  return (
    <AppBar position="static" classes={{ root: classes.appBar }}>
      <Tabs value={pathname} classes={{ root: classes.tabs }}>
        {pages.map(p => <LinkTab key={p.path} label={p.label} to={p.path} value={p.path} />)}
      </Tabs>
      <SignOutButton className={classes.signOutButton} />
    </AppBar>
  );
}

export default memo(Header);
