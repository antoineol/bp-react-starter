import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { FC, memo } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      overflow: 'auto',
    },
  }),
);

interface Props {
}

export const Layout: FC<Props> = memo(({ children }) => {
  const classes = useStyles(); // MUI Styles
  return (
    <div className={classes.root} data-testid={'layout'}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </div>
  );
});
