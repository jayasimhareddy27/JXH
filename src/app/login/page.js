'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, signupUser } from '@lib/redux/features/auth/thunks';
import { Companynameletters } from '@/globalvar/companydetails';
import { signIn } from 'next-auth/react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const isLoading = loading === 'loading';

  // 1. Mount check for Next.js hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Straight Redirect: If Redux user exists, go to home
  useEffect(() => {
    if (mounted && user) {
      router.push('/');
    }
  }, [user, router, mounted]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email: form.email, password: form.password }));
    } else {
      dispatch(signupUser(form));
    }
  };

  // 3. Unified Social Login Handler
  const handleSocialLogin = (provider) => {
    signIn(provider, { callbackUrl: '/' });
  };

  if (!mounted || user) return null; 

  return (
    <div className="min-h-screen grid grid-cols-12 bg-gradient-to-br from-[var(--color-illustration-secondary)] via-[var(--color-illustration-tertiary)] to-[var(--color-illustration-tertiary)] relative overflow-hidden">
      
      {/* LEFT SIDE: Branding & Animation */}
      <div className="col-span-12 lg:col-span-7 lg:flex flex-col items-center justify-center p-8 z-10">
        <div className="text-center md:max-w-[80%]">
          <div className="flex justify-center md:gap-2 md:mb-6">
            {Companynameletters.map((letter, i) => (
              <span 
                key={i} 
                className="text-5xl font-extrabold animate-[letterFade_1.5s_ease-in-out_infinite]" 
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {letter}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold">Unleash Your Potential with JXC</h1>
          <p className="text-lg opacity-70 mt-3">Streamline tasks and achieve more with our intuitive platform.</p>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="col-span-12 lg:col-span-5 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md p-8 space-y-6 bg-[var(--color-card-bg)] rounded-2xl shadow-modal border border-[var(--color-illustration-stroke)]/10">
          <h2 className="text-2xl font-bold text-[var(--color-form-label)] text-center">
            {isLogin ? 'Log In' : 'Sign Up'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--color-form-label)]">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Full Name"
                  className="form-input w-full p-2 border rounded"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-form-label)]">Email</label>
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                placeholder="Email Address"
                className="form-input w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-form-label)]">Password</label>
              <input 
                type="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                required 
                placeholder="••••••••"
                className="form-input w-full p-2 border rounded"
              />
            </div>
            
            {error && <p className="text-center text-sm text-red-600 font-medium">{error}</p>}
            
            <button 
              type="submit" 
              disabled={isLoading} 
              className={`w-full py-3 bg-blue-600 text-white rounded-lg font-semibold transition-all hover:bg-blue-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          {/* Social Auth Section (Only visible on Login state) */}
          {isLogin && (
            <div className="space-y-4">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-bold">Or continue with</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>


              {/* Full width buttons for GitHub & LinkedIn */}
              <div className="space-y-2">
                <button 
                  onClick={() => handleSocialLogin('google')} 
                  className="w-full flex items-center justify-center py-2.5 bg-[#f33b3b] text-white rounded-lg hover:bg-[#1b1f23] transition"
                >
                  <span className="text-sm font-semibold">Google</span>
                </button>
                   {/**
                
                <button 
                  onClick={() => handleSocialLogin('facebook')} 
                  className="w-full flex items-center justify-center py-2.5 bg-[#0080ff] text-white rounded-lg hover:bg-[#1b1f23] transition"
                >
                  <span className="text-sm font-semibold">Facebook</span>
                </button>
                <button 
                  onClick={() => handleSocialLogin('github')} 
                  className="w-full flex items-center justify-center py-2.5 bg-[#24292e] text-white rounded-lg hover:bg-[#1b1f23] transition"
                >
                  <span className="text-sm font-semibold">Sign in with GitHub</span>
                </button>
                <button 
                  onClick={() => handleSocialLogin('linkedin')} 
                  className="w-full flex items-center justify-center py-2.5 bg-[#195d82] text-white rounded-lg hover:bg-[#005a87] transition"
                >
                  <span className="text-sm font-semibold">Sign in with LinkedIn</span>
                   * 
                </button>
                   */}
              </div>
            </div>
          )}

          <div className="text-center pt-2">
            <button 
              className="text-blue-600 hover:underline text-sm font-medium" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "New user? Create an account" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}