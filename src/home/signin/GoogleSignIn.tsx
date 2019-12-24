import { Button, createStyles, Icon, makeStyles, Theme } from '@material-ui/core';
import React, { MouseEventHandler } from 'react';
import { env } from '../../environment/env';
import signInIcon from '../../resources/btn_google_dark_normal_ios.svg';

const useStyles = makeStyles((theme: Theme) => createStyles({
  button: {
    margin: theme.spacing(1),
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  imageIcon: {
    display: 'block',
    height: 42,
    width: 42,
  },
  iconRoot: {
    textAlign: 'center',
    height: 42,
    width: 42,
  },
  startIcon: {
    marginLeft: 0,
  },
}));

export function GoogleSignIn() {
  const classes = useStyles();
  const signIn: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    window.open(`${env.apiPath}/auth/google/signin`, 'signIn', 'width=600,height=800');
  };
  return <Button
    variant="contained"
    color="primary"
    className={classes.button}
    classes={{ startIcon: classes.startIcon }}
    size={'large'}
    startIcon={<Icon classes={{ root: classes.iconRoot }}>
      <img className={classes.imageIcon} src={signInIcon} alt="Sign in" />
    </Icon>}
    onClick={signIn}
  >
    Sign in with Google
  </Button>;
}
