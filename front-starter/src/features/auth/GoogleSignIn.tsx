import React, { memo, useCallback, useState } from 'react';
import GoogleLogin from 'react-google-login';
import { handleError } from '../../common/services/error.service';
import { useAsyncHandler } from '../../common/utils/app.utils';
import { env } from '../../environment/env';
import { fetchJwtFromGoogleToken } from './auth.service';

function GoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const startSignIn = useCallback(() => {
    setLoading(true);
  }, []);
  const handleFailure = useCallback(err => {
    setLoading(false);
    handleError(err);
  }, []);
  const handleSuccess = useAsyncHandler(fetchJwtFromGoogleToken, setLoading);

  return <GoogleLogin
    clientId={env.googleClientID}
    buttonText="Sign in with Google"
    onSuccess={handleSuccess}
    onFailure={handleFailure}
    onRequest={startSignIn}
    cookiePolicy={'none'}
    hostedDomain={'earlymetrics.com'}
    // autoLoad
    theme={'dark'}
    disabled={loading}
  />;
}

export default memo(GoogleSignIn);
