import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const { token, user } = response.data;
      login(token, user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-neutral-950 text-white">
      {/* Background Gradients (Subtle) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neutral-800/30 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-neutral-700/30 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-10 mx-4"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-neutral-400">
            Sign in to continue your journey
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-white transition-colors h-5 w-5" />
              <input
                id="username"
                type="text"
                {...register('username')}
                placeholder="Username"
                className="w-full bg-black/20 border border-white/10 text-white placeholder-neutral-500 rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-white/50 focus:border-transparent transition-all hover:bg-black/40"
              />
            </div>
            {errors.username && (
              <p className="text-red-400 text-xs ml-1">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-white transition-colors h-5 w-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Password"
                className="w-full bg-black/20 border border-white/10 text-white placeholder-neutral-500 rounded-xl pl-10 pr-12 py-3.5 focus:outline-none focus:ring-1 focus:ring-white/50 focus:border-transparent transition-all hover:bg-black/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs ml-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-white focus:ring-white border-neutral-600 rounded bg-black/20"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-400">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <button
                type="button"
                onClick={() => toast('Forgot Password feature coming soon!', { icon: '🚧' })}
                className="font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3.5 border border-transparent text-sm font-semibold rounded-xl text-black bg-white hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-500">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-medium text-white hover:text-neutral-300 transition-colors underline decoration-neutral-700 underline-offset-4"
          >
            Create one today
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
