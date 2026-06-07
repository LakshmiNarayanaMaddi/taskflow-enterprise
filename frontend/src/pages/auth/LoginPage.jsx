import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../../store/authSlice';
import { authApi } from '../../api/auth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const LoginPage = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      const response = await authApi.login(data);
      dispatch(setCredentials(response));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeycloakLogin = () => {
  const keycloakUrl = 'http://localhost:8180/realms/taskflow/protocol/openid-connect/auth';
  const params = new URLSearchParams({
    client_id: 'taskflow-frontend',
    redirect_uri: 'http://localhost:5173/auth/callback',
    response_type: 'code',
    scope: 'openid profile email',
  });
  window.location.href = `${keycloakUrl}?${params}`;
};

  return (
    <div className="min-h-screen bg-gradient-to-br
                    from-primary-50 to-blue-100
                    flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg
                      w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center
                          w-12 h-12 bg-primary-600 rounded-xl mb-4">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            TaskFlow
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to your workspace
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200
                          text-red-700 px-4 py-3 rounded-lg
                          text-sm mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            register={register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            register={register('password')}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full mt-2"
          >
            Sign in
          </Button>
        </form>

        {/* Divider */}
<div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-200" />
  </div>
  <div className="relative flex justify-center text-xs">
    <span className="bg-white px-3 text-gray-400">
      or continue with
    </span>
  </div>
</div>

{/* Keycloak SSO button */}
<button
  onClick={handleKeycloakLogin}
  className="w-full flex items-center justify-center gap-3
             px-4 py-2.5 border border-gray-300 rounded-lg
             text-sm font-medium text-gray-700
             hover:bg-gray-50 transition-colors"
>
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26
         1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92
         3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23
         1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99
         20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43
         8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09
         14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6
         3.3-4.53 6.16-4.53z"/>
  </svg>
  Continue with Google via SSO
</button>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register"
                className="text-primary-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;