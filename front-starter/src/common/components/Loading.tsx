import { CircularProgress, createStyles, makeStyles, Theme } from '@material-ui/core';
import { CircularProgressProps } from '@material-ui/core/CircularProgress/CircularProgress';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React, { FC, memo } from 'react';

interface Props extends CircularProgressProps {
  inline?: boolean;
  medium?: boolean;
}

// An issue with TypeScript prevents CSS properties auto-completion. We can
// hope to have a fix in TypeScript 3.3. Issues to follow up:
// https://github.com/Microsoft/TypeScript/issues/22077
// https://github.com/mui-org/material-ui/issues/11693
// A workaround to have auto-completion is to set CSSProperties type to class values as below.
const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  withSpace: {
    marginTop: theme.spacing(4),
  } as CSSProperties,
}));

export const Loading: FC<Props> = memo(({ inline, medium, className, ...others }) => {
  const classes = useStyles(); // MUI Styles
  const classBlock = !inline ? classes.withSpace : undefined;
  return <div className={`${classes.root} ${classBlock} ${className}`}><CircularProgress
    size={medium ? 30 : undefined} {...others} />
  </div>;
});
