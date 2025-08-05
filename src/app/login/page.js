'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Companynameletters } from '@/globalvar/companydetails';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = '/';
    }
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/';
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-12 bg-gradient-to-br from-[var(--color-illustration-secondary)] via-[var(--color-illustration-tertiary)] to-[var(--color-illustration-tertiary)] relative overflow-hidden">
      <div className="col-span-12 lg:col-span-7 lg:flex flex-col items-center justify-center p-8 z-10">
        <div className="text-center md:max-w-[80%]">
          <div className="flex justify-center md:gap-2 md:mb-6">
            {Companynameletters.map((letter, i) => (
              <span
                key={letter}
                className="text-5xl font-extrabold animate-[letterFade_1.5s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {letter}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold">Unleash Your Potential with JXH</h1>
          <p className="text-lg opacity-70 mt-3">
            Streamline tasks, collaborate effortlessly, and achieve more with our intuitive platform.
          </p>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-5 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md p-8 space-y-6 bg-[var(--color-card-bg)] rounded-2xl shadow-modal border border-[var(--color-illustration-stroke)]/10">
          <h2 className="text-2xl font-bold text-[var(--color-form-label)] text-center">
            {isLogin ? 'Log In' : 'Sign Up'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1 text-[var(--color-form-label)]"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="form-input"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-[var(--color-form-label)]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="form-input"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1 text-[var(--color-form-label)]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="form-input"
              />
            </div>

            {error && <p className="text-center text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`form-button w-full py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          {isLogin ? (
            <>
              <div className="text-center text-sm text-[var(--color-paragraph)]">or</div>
              <button
                type="button"
                onClick={() => signIn('google')}
                className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-3 transition"
              >
                Log in with Google
              </button>
              <p className="text-center text-sm text-[var(--color-paragraph)] mt-4">
                New user?{' '}
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                  }}
                  className="text-[var(--color-form-button-bg)] hover:underline"
                >
                  Sign up
                </button>
              </p>
            </>
          ) : (
            <p className="text-center text-sm text-[var(--color-paragraph)] mt-4">
              Already registered?{' '}
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className="text-[var(--color-form-button-bg)] hover:underline"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
