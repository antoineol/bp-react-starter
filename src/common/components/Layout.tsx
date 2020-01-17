import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { FC, memo } from 'react';

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

const Layout: FC<Props> = ({ children }) => {
  const classes = useStyles(); // MUI Styles
  return (
    <div className={classes.root}>
      {children}
    </div>
  );
};

export default memo(Layout);