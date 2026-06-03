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

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  email:     z.string().email('Invalid email address'),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
});

const RegisterPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      const response = await authApi.register(data);
      dispatch(setCredentials(response));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br
                    from-primary-50 to-blue-100
                    flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg
                      w-full max-w-md p-8">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center
                          w-12 h-12 bg-primary-600 rounded-xl mb-4">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create account
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Start managing your projects today
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200
                          text-red-700 px-4 py-3 rounded-lg
                          text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name"
              placeholder="John"
              register={register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              label="Last name"
              placeholder="Doe"
              register={register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
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
            placeholder="Min. 8 characters"
            register={register('password')}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full mt-2"
          >
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login"
                className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;