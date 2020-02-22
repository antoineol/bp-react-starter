import { Typography } from '@material-ui/core';
import React, { memo } from 'react';
import { isObject } from '../utils/app.utils';

interface Props {
  error: any | any[];
}

function ErrorComp({ error }: Props) {
  const err: any[] = Array.isArray(error) ? error : [error];
  return <>
    {err.map((e, i) => <Typography color={'error'} key={i}>{printable(e)}</Typography>)}
  </>;
}

function printable(error: any) {
  return isObject(error) || Array.isArray(error) ? JSON.stringify(error) : error;
}

export default memo(ErrorComp);
