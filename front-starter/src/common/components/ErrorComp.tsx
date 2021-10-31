import { Alert, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { FC, memo, PropsWithChildren } from 'react';
import { isObject } from '../utils/app.utils';

const PREFIX = 'ErrorComp';

const classes = {
  root: `${PREFIX}-root`,
};

const StyledAlert = styled(Alert)(({ theme }) => ({
  [`&.${classes.root}`]: {
    alignSelf: 'center',
    marginTop: theme.spacing(3),
  },
}));

// Useful for user-friendly wording and translations.
const errorLabels: any = {
  unknownError: 'An unknown error occurred.',
};

export {};

interface Props {
  error?: any | any[];
}

const ErrorComp: FC<PropsWithChildren<Props>> = memo(({ error, children }) => {
  if (!error && !children) {
    return null;
  }
  if (error) {
    const err: any[] = Array.isArray(error) ? error : [error];
    return (
      <>
        {err.map((e, i) => (
          <Typography color={'error'} key={i}>
            {printable(e)}
          </Typography>
        ))}
      </>
    );
  }
  return (
    <StyledAlert severity={'error'} className={classes.root}>
      {children}
    </StyledAlert>
  );
});

function printable(error: any) {
  const err = error?.response?.data || error;
  const key: keyof typeof errorLabels = err?.message;
  const displayed =
    key && errorLabels[key]
      ? errorLabels[key]
      : key
      ? key
      : err || error || errorLabels.unknownError;
  return isObject(displayed) || Array.isArray(displayed)
    ? JSON.stringify(displayed)
    : displayed;
}

export default ErrorComp;
