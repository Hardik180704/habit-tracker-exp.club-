import { useState } from 'react';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', data);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center font-sans">
      <div className="w-full max-w-[1400px] lg:h-[calc(100vh-2rem)] min-h-[600px] grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Column - Visuals */}
        <div className="hidden lg:flex relative h-full w-full bg-indigo-600 rounded-[32px] overflow-hidden flex-col justify-between p-12">
             {/* Gradient Background */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#a855f7_0%,_#4f46e5_40%,_#000000_100%)] opacity-90"></div>
             
             {/* Content */}
             <div className="relative z-10">
                 <div className="flex items-center gap-3">
                    <img src="/logo-512.png" alt="Onyx Logo" className="w-8 h-8 rounded-lg" />
                    <span className="text-xl font-bold font-['Outfit']">Onyx</span>
                 </div>
                 <p className="text-[10px] font-extrabold tracking-[0.2em] text-white/50 mt-2 uppercase font-['Outfit'] ml-1">Stay Locked In</p>
             </div>

             <div className="relative z-10 max-w-md">
                 <h1 className="text-4xl font-bold mb-4">Get Started with Us</h1>
                 <p className="text-gray-300 mb-12 text-lg">Complete these easy steps to register your account.</p>

                 <div className="space-y-4">
                     {/* Step 1 - Active */}
                     <div className="bg-white text-black p-4 rounded-xl flex items-center gap-4 shadow-lg">
                         <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                         <span className="font-semibold">Sign up your account</span>
                     </div>

                     {/* Step 2 - Inactive */}
                     <div className="bg-white/10 text-white p-4 rounded-xl flex items-center gap-4 border border-white/5">
                         <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                         <span className="font-medium text-gray-300">Set up your workspace</span>
                     </div>

                      {/* Step 3 - Inactive */}
                 <div className="mt-12 pt-8 border-t border-white/10">
                     <p className="text-sm font-medium text-gray-400 mb-4">Powering your habits with</p>
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-[#1DB954]/20 flex items-center justify-center border border-[#1DB954]/20 backdrop-blur-sm">
                            <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 14.52 1.141.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.24z"/>
                            </svg>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
                            </svg>
                         </div>
                         <span className="text-gray-400 text-sm ml-2">+ many more</span>
                     </div>
                 </div>
                 </div>
             </div>
             
             <div className="relative z-10 text-xs text-white/40 font-medium">
                 © 2025 Onyx Inc.
             </div>
        </div>


        {/* Right Column - Form */}
        <div className="h-full flex flex-col justify-center items-center p-8 lg:p-12 relative">
             <div className="w-full max-w-md">
                <div className="text-center lg:text-left mb-8">
                     <h2 className="text-3xl font-bold mb-2">Sign Up Account</h2>
                     <p className="text-gray-400 text-sm">Enter your personal data to create your account.</p>
                </div>

                {/* Social Login OMITTED as requested */}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                        <input 
                            type="text"
                            {...register('username')}
                            placeholder="eg. JohnDoe"
                            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
                        />
                         {errors.username && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.username.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                        <input 
                            type="email"
                            {...register('email')}
                            placeholder="eg. john@example.com"
                            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                        <input 
                            type="password"
                            {...register('password')}
                            placeholder="Enter your password"
                            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
                        />
                        <p className="text-[#4A4A4A] text-[10px] mt-1.5 ml-1">Must be at least 6 characters.</p>
                         {errors.password && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-bold h-12 rounded-xl mt-6 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
                    </button>
                </form>

                 <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Log in</Link>
                </div>
             </div>
        </div>
      </div>
    </div>

  );
};

export default Register;
