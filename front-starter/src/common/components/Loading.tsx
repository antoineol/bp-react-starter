import { CircularProgress } from '@mui/material';
import { CircularProgressProps } from '@mui/material/CircularProgress/CircularProgress';
import { styled } from '@mui/material/styles';
import React, { FC, memo } from 'react';

const PREFIX = 'Loading';

const classes = {
  root: `${PREFIX}-root`,
  withSpace: `${PREFIX}-withSpace`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.root}`]: {
    display: 'flex',
    justifyContent: 'center',
  },

  [`& .${classes.withSpace}`]: {
    marginTop: theme.spacing(4),
  },
}));

interface Props extends CircularProgressProps {
  inline?: boolean;
  medium?: boolean;
}

export const Loading: FC<Props> = memo(
  ({ inline, medium, className, ...others }) => {
    const classBlock = !inline ? classes.withSpace : undefined;
    return (
      <Root className={`${classes.root} ${classBlock} ${className}`}>
        <CircularProgress size={medium ? 30 : undefined} {...others} />
      </Root>
    );
  },
);
