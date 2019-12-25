import { Typography } from '@material-ui/core';
import React, { memo } from 'react';

interface Props {
  error: any;
}

function ErrorComp({ error }: Props) {
  return <Typography color={'error'}>{error}</Typography>;
}

export default memo(ErrorComp);
