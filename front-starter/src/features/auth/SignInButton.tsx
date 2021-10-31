import { useAuth0 } from '@auth0/auth0-react';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Button } from '@mui/material';
import React, { FC, memo } from 'react';

export const SignInButton: FC<{ className?: string }> = memo(props => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  // loginWithPopup blocks loading. The app has no way to know when the popup is closed.
  // So we favor loginWithRedirect here.
  // Example attempt to make it work, still failing, not catching when the popup is closed.
  // We could work around it by providing our own popup, but is it worth the effort?
  // const [loading, setLoading] = useState(false);
  // const handleClick = useCallback(() => {
  //   setLoading(true);
  //   loginWithPopup()
  //     .then(() => setLoading(false))
  //     .catch(() => setLoading(false));
  // }, []);

  if (isAuthenticated) {
    return null;
  }
  return (
    <>
      <Button
        variant='outlined'
        size={'medium'}
        disabled={isLoading}
        startIcon={<VpnKeyIcon />}
        onClick={loginWithRedirect}
        {...props}
      >
        Sign in
      </Button>
    </>
  );
});
