import { Typography } from '@material-ui/core';
import React, { memo } from 'react';
import { isObject } from '../utils/app.utils';

interface Props {
  error: any;
}

function ErrorComp({ error }: Props) {
  const err = isObject(error) || Array.isArray(error) ? JSON.stringify(error) : error;
  return <Typography color={'error'}>{err}</Typography>;
}

export default memo(ErrorComp);
