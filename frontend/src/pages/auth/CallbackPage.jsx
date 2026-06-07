import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import axios from 'axios';

const CallbackPage = () => {
  const [searchParams]    = useSearchParams();
  const navigate          = useNavigate();
  const dispatch          = useDispatch();
  const [error, setError] = useState('');
  const hasRun            = useRef(false);

  useEffect(() => {
    // Prevent double execution in development
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get('code');
    if (!code) {
      setError('No authorization code received');
      return;
    }

    exchangeCodeForToken(code);
  }, []);

  const exchangeCodeForToken = async (code) => {
    try {
      const tokenResponse = await axios.post(
        'http://localhost:8180/realms/taskflow/protocol/openid-connect/token',
        new URLSearchParams({
          grant_type:   'authorization_code',
          client_id:    'taskflow-frontend',
          code:          code,
          redirect_uri: 'http://localhost:5173/auth/callback',
        }),
        { headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }}
      );

      const { access_token } = tokenResponse.data;

      const userResponse = await axios.get(
        'http://localhost:8180/realms/taskflow/protocol/openid-connect/userinfo',
        { headers: { Authorization: `Bearer ${access_token}` }}
      );

      const { sub, email } = userResponse.data;

      dispatch(setCredentials({
        accessToken: access_token,
        userId:      sub,
        email:       email,
        role:        'MEMBER',
      }));

      navigate('/dashboard');

    } catch (err) {
      console.error('OAuth callback error:', err.response?.data || err);
      setError('Login failed. Please try again.');
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center
                      justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-gray-500 text-sm">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center
                    justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4
                        border-primary-600 border-t-transparent
                        rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default CallbackPage;