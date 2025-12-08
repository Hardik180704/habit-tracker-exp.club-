import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordData>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const onSubmit = async (data: ResetPasswordData) => {
    if (data.password !== data.confirmPassword) {
        toast.error("Passwords don't match");
        return;
    }

    try {
      await api.post('/auth/reset-password', {
          token,
          newPassword: data.password
      });
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
       const err = error as AxiosError<{ error: string }>;
       toast.error(err.response?.data?.error || 'Failed to reset password');
    }
  };

  if (!token) {
      return (
        <div className="h-screen flex items-center justify-center bg-white dark:bg-black text-center">
            <div>
                <h2 className="text-2xl font-bold dark:text-white mb-2">Invalid Link</h2>
                <p className="text-gray-500 mb-4">This password reset link is invalid or missing.</p>
                <Link to="/login" className="text-indigo-600 font-bold hover:underline">Return to Login</Link>
            </div>
        </div>
      );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-[#000000] overflow-hidden">
      {/* Left Column - Image/Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-[#F5F5F7] dark:bg-[#111111] items-center justify-center p-12 overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-green-500/20 to-emerald-500/20 rounded-full blur-[100px] animate-pulse"></div>
         <div className="relative z-10 text-center max-w-lg">
            <h1 className="text-8xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-black to-gray-400 dark:from-white dark:to-gray-600 drop-shadow-sm">ONYX.</h1>
            <p className="text-2xl font-medium text-gray-500 dark:text-gray-400 tracking-tight">Secure your account.</p>
         </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 xl:px-24 dark:text-white relative z-10">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-10">
             <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">New Password</h2>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Create a strong password for your account.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
               <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">New Password</label>
               <input
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                  type="password"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="••••••••"
               />
               {errors.password && <p className="text-red-500 text-xs ml-1 font-medium">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
               <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">Confirm Password</label>
               <input
                  {...register("confirmPassword", { required: "Please confirm password" })}
                  type="password"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="••••••••"
               />
               {errors.confirmPassword && <p className="text-red-500 text-xs ml-1 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <div className="pt-2">
               <button
               type="submit"
               disabled={isSubmitting}
               className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl text-sm transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg shadow-black/5 dark:shadow-white/5"
               >
                 {isSubmitting ? "Resetting..." : "Reset Password"}
               </button>
            </div>
          </form>

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

export default ResetPassword;
