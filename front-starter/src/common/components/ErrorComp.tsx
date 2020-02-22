import { Typography } from '@material-ui/core';
import React, { FC, memo, PropsWithChildren } from 'react';
import { isObject } from '../utils/app.utils';

interface Props {
  error?: any | any[];
}

const ErrorComp: FC<PropsWithChildren<Props>> = ({ error, children }) => {
  if (error) {
    const err: any[] = Array.isArray(error) ? error : [error];
    return <>
      {err.map((e, i) => <Typography color={'error'} key={i}>{printable(e)}</Typography>)}
    </>;
  }
  return <Typography color={'error'}>{children}</Typography>;
};

function printable(error: any) {
  return isObject(error) || Array.isArray(error) ? JSON.stringify(error) : error;
}

export default memo(ErrorComp);
