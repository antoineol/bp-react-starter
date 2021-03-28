import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { Alert } from '@material-ui/lab';
import React, { FC, memo, PropsWithChildren } from 'react';
import { isObject } from '../utils/app.utils';

// Useful for user-friendly wording and translations.
const errorLabels: any = {
  unknownError: 'An unknown error occurred.',
};

export const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    alignSelf: 'center',
    marginTop: theme.spacing(3),
  } as CSSProperties,
}));

interface Props {
  error?: any | any[];
}

const ErrorComp: FC<PropsWithChildren<Props>> = memo(({ error, children }) => {
  const classes = useStyles();
  if (!error && !children) {
    return null;
  }
  if (error) {
    const err: any[] = Array.isArray(error) ? error : [error];
    return <>
      {err.map((e, i) => <Typography color={'error'} key={i}>{printable(e)}</Typography>)}
    </>;
  }
  return <Alert severity={'error'} className={classes.root}>{children}</Alert>;
});

function printable(error: any) {
  const err = error?.response?.data || error;
  const key: keyof typeof errorLabels = err?.message;
  const displayed = key && errorLabels[key] ? errorLabels[key] :
    key ? key :
      (err || error || errorLabels.unknownError);
  return isObject(displayed) || Array.isArray(displayed) ? JSON.stringify(displayed) : displayed;
}

export default ErrorComp;
