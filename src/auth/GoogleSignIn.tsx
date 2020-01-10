import { Button, createStyles, Icon, makeStyles, Theme } from '@material-ui/core';
import React, { Fragment, memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../common/app.utils';
import ErrorComp from '../common/components/ErrorComp';
import signInIcon from '../resources/btn_google_dark_normal_ios.svg';
import { AuthAT, selectAuthError, selectAuthLoading } from './auth.service';

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

function GoogleSignIn() {
  const classes = useStyles(); // MUI Styles
  const loading = useSelector(selectAuthLoading); // Redux Selectors
  const error = useSelector(selectAuthError);
  const dispatch = useAppDispatch(); // Redux dispatcher
  // Callback optimized to keep the same reference to avoid re-rendering child components
  const handleSignIn = useCallback(() => dispatch(AuthAT.SignIn), [dispatch]);

  return <Fragment>
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      classes={{ startIcon: classes.startIcon }}
      size={'large'}
      disabled={loading}
      startIcon={<Icon classes={{ root: classes.iconRoot }}>
        <img className={classes.imageIcon} src={signInIcon} alt="Sign in" />
      </Icon>}
      onClick={handleSignIn}
    >
      Sign in with Google
    </Button>
    <ErrorComp error={error} />
  </Fragment>;
}

export default memo(GoogleSignIn);
