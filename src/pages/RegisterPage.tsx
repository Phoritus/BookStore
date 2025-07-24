import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Coffee, Mail, Phone, Lock, Eye, EyeOff, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { validateNationalId } from '../utils/helpers';
import type { RegisterFormData } from '../types';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^(\+66|0)[0-9]{8,9}$/, 'Please enter a valid Thai phone number'),
  nationalId: z.string().refine(validateNationalId, 'Please enter a valid Thai National ID'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const success = await registerUser(data);
      
      if (success) {
        toast.success('Registration successful! Welcome to Book Café!');
        navigate('/dashboard');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    }
  };

  return (
    <div className="page-container">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Coffee className="h-12 w-12 mx-auto text-brown-500 mb-4" />
            <h2 className="text-3xl font-display font-bold text-darkBrown-500">
              Join Book Café
            </h2>
            <p className="mt-2 text-brown-600">
              Create your account to access room bookings and member benefits
            </p>
          </div>

          <div className="card p-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-darkBrown-500 mb-2">
                  Email Address *
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
                  Phone Number *
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
                <label htmlFor="nationalId" className="block text-sm font-medium text-darkBrown-500 mb-2">
                  National ID Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-brown-400" />
                  </div>
                  <input
                    {...register('nationalId')}
                    type="text"
                    className="input-field pl-10"
                    placeholder="1-XXXX-XXXXX-XX-X"
                    maxLength={17}
                  />
                </div>
                {errors.nationalId && (
                  <p className="mt-1 text-sm text-red-600">{errors.nationalId.message}</p>
                )}
                <p className="mt-1 text-xs text-brown-500">
                  Required for entry card exchange and verification
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-darkBrown-500 mb-2">
                    First Name *
                  </label>
                  <input
                    {...register('firstName')}
                    type="text"
                    className="input-field"
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-darkBrown-500 mb-2">
                    Last Name *
                  </label>
                  <input
                    {...register('lastName')}
                    type="text"
                    className="input-field"
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-darkBrown-500 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-brown-400" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pl-10 pr-10"
                    placeholder="Create a password"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-darkBrown-500 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-brown-400" />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="input-field pl-10 pr-10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-brown-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-brown-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="bg-cream-200 p-4 rounded-lg">
                <h4 className="font-medium text-darkBrown-500 mb-2">What you'll get:</h4>
                <ul className="text-sm text-brown-600 space-y-1">
                  <li>• Access to private study rooms</li>
                  <li>• Online booking system</li>
                  <li>• Member discounts (15% off 5+ hour bookings)</li>
                  <li>• QR code confirmations</li>
                  <li>• Book lending privileges</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-brown-600">
                Already have an account?{' '}
                <Link to="/login" className="text-brown-500 hover:text-brown-600 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link 
              to="/" 
              className="text-brown-500 hover:text-brown-600 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
