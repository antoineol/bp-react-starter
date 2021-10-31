import { useAuth0 } from '@auth0/auth0-react';
import {
  AppBar,
  Avatar,
  Box,
  ButtonBaseProps,
  buttonClasses,
  Stack,
  Tab,
  Tabs,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { FC, memo } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Auth0User } from '../../features/auth/auth.models';
import { SignInButton } from '../../features/auth/SignInButton';
import { SignOutButton } from '../../features/auth/SignOutButton2';
import { Loading } from './Loading';

interface Page {
  path: string;
  label: string;
}

const pages: Page[] = [
  { path: '/', label: 'Home' },
  { path: '/profile', label: 'Profile' },
];

interface LinkTabProps extends ButtonBaseProps {
  label?: string;
  to?: string;
}

function LinkTab(props: LinkTabProps) {
  return <Tab component={Link} {...(props as any)} />;
}

export const AppBarStyled = styled(AppBar)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  [`& .${buttonClasses.root}`]: {
    margin: theme.spacing(0, 1),
  },
}));

export const Header: FC = memo(() => {
  const { pathname } = useLocation();

  return (
    <AppBarStyled position='static' data-testid={'header'}>
      <Tabs value={pathname} sx={{ flexGrow: 1 }}>
        {pages.map(p => (
          <LinkTab key={p.path} label={p.label} to={p.path} value={p.path} />
        ))}
      </Tabs>
      <Stack direction={'row'}>
        {/*<ConnectionStatus />*/}
        <UserAvatar />
        <SignInButton />
        <SignOutButton />
      </Stack>
    </AppBarStyled>
  );
});

const UserAvatar: FC = memo(() => {
  const { isLoading, isAuthenticated, user } = useAuth0();
  if (isLoading)
    return (
      <Loading
        inline
        color={'inherit'}
        sx={{ marginRight: 1, overflow: 'hidden' }}
      />
    );
  if (!isAuthenticated) return null;
  const { name, picture } = user as Auth0User;

  return (
    <>
      <Box sx={{ margin: 1 }}>{name}</Box>
      <Avatar src={picture} />
    </>
  );
});
