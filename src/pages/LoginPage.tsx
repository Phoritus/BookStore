import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Coffee, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^(\+66|0)[0-9]{8,9}$/, 'Please enter a valid Thai phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = {
  email: string;
  phone: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data);
    if (success) {
      navigate('/dashboard');
    }
  };

  const fillTestData = () => {
    setValue('email', 'test@test.com');
    setValue('phone', '0812345678');
    setValue('password', '123456');
  };

  return (
    <div className="page-container">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Coffee className="h-12 w-12 mx-auto text-brown-500 mb-4" />
            <h2 className="text-3xl font-display font-bold text-darkBrown-500">
              Welcome Back
            </h2>
            <p className="mt-2 text-brown-600">
              Sign in to your Book Café account
            </p>
          </div>

          

          <div className="card p-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-darkBrown-500 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-brown-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    className="input-field pl-10"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-darkBrown-500 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-brown-400" />
                  </div>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="input-field pl-10"
                    placeholder="08X-XXX-XXXX"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-darkBrown-500 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-brown-400" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-brown-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-brown-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-brown-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-brown-500 hover:text-brown-600 font-medium">
                  Register here
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-brown-500 hover:text-brown-600 text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
