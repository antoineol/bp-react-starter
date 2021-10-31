import { Button, circularProgressClasses } from '@mui/material';
import { ButtonProps } from '@mui/material/Button/Button';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

export const PageWrapper = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const LogoImg = styled('img')({
  animation: 'Home-logo-spin infinite 20s linear',
  height: 150,
  '@keyframes Home-logo-spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
});

export const IncrButtonStyle = styled(Button)({
  marginTop: '1rem',
  [`& .${circularProgressClasses.root}`]: {
    marginLeft: '0.5rem',
  },
});

export const IncrButton: FC<ButtonProps> = props => (
  <IncrButtonStyle variant={'outlined'} color={'primary'} {...props} />
);
