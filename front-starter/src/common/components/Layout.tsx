import { styled } from '@mui/material/styles';
import React, { FC, memo } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

const PREFIX = 'Layout';

const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'auto',
  },
}));

interface Props {}

export const Layout: FC<Props> = memo(({ children }) => {
  return (
    <Root className={classes.root} data-testid={'layout'}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Root>
  );
});
