import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface ForgotPasswordData {
  email: string;
}

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordData>();
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      await api.post('/auth/forgot-password', data);
      setIsSuccess(true);
      toast.success('Reset link sent!');
    } catch (error) {
       const err = error as AxiosError<{ error: string }>;
       toast.error(err.response?.data?.error || 'Failed to send request');
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-[#000000] overflow-hidden">
      {/* Left Column - Image/Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-[#F5F5F7] dark:bg-[#111111] items-center justify-center p-12 overflow-hidden">
         {/* Abstract Gradient Blob */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>

         <div className="relative z-10 text-center max-w-lg">
            <h1 className="text-8xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-black to-gray-400 dark:from-white dark:to-gray-600 drop-shadow-sm">ONYX.</h1>
            <p className="text-2xl font-medium text-gray-500 dark:text-gray-400 tracking-tight">Stay Locked In.</p>
         </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 xl:px-24 dark:text-white relative z-10">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-10">
             <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white mb-6 inline-flex items-center gap-1 transition-colors">
                ← Back to Login
             </Link>
             <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Forgot Password?</h2>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your email and we'll send you a recovery link.</p>
          </div>

          {isSuccess ? (
            <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-green-800 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    📧
                </div>
                <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-2">Check your email</h3>
                <p className="text-sm text-green-700 dark:text-green-300/80 mb-6">We have sent a password reset link to your email address.</p>
                <button onClick={() => setIsSuccess(false)} className="text-sm font-semibold text-green-700 hover:underline">
                    Click to resend
                </button>
            </div>
          ) : (
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                   <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">Email Address</label>
                   <input
                      {...register("email", { required: "Email is required" })}
                      type="email"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-gray-900 dark:text-white placeholder-gray-400"
                      placeholder="john@example.com"
                   />
                   {errors.email && <p className="text-red-500 text-xs ml-1 font-medium">{errors.email.message}</p>}
                </div>

                <div className="pt-2">
                   <button
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl text-sm transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg shadow-black/5 dark:shadow-white/5"
                   >
                     {isSubmitting ? "Sending..." : "Send Reset Link"}
                   </button>
                </div>
             </form>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-100 dark:border-white/5 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-600">
              &copy; {new Date().getFullYear()} Onyx. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
