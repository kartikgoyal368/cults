"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import styles from './page.module.css';

interface AuthFormProps {
  sessionUser?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export default function AuthForm({ sessionUser }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(
    tabParam === 'signup' ? 'signup' : 'login'
  );

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setError(null);
    setSuccessMessage(null);
  };

  const callbackUrl = searchParams.get('callbackUrl') || '/account';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email: loginEmail.toLowerCase().trim(),
        password: loginPassword,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password. Please verify your credentials.');
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError('Something went wrong during sign in. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account.');
        setIsLoading(false);
        return;
      }

      // Automatically sign in the user
      const loginRes = await signIn('credentials', {
        email: signupEmail.toLowerCase().trim(),
        password: signupPassword,
        redirect: false,
      });

      if (loginRes?.error) {
        setSuccessMessage('Account created successfully! Please sign in with your password.');
        setActiveTab('login');
        setLoginEmail(signupEmail);
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError('An error occurred during registration. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn('google', { callbackUrl });
    } catch (err: any) {
      setError('Failed to initiate Google sign in. Please check configuration.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h1 className={styles.title}>
        {activeTab === 'login' ? "LOGIN" : "SIGN UP"}
      </h1>

      {/* Tabs Header */}
      <div className={styles.tabsHeader}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'login' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('login')}
        >
          SIGN IN
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'signup' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('signup')}
        >
          CREATE ACCOUNT
        </button>
      </div>

      {sessionUser && (
        <div className={styles.sessionBanner}>
          Currently signed in as <strong>{sessionUser.name || sessionUser.email}</strong>.{' '}
          <Link href="/account">Go to My Account</Link>
        </div>
      )}

      {error && <div className={styles.alertError}>{error}</div>}
      {successMessage && <div className={styles.alertSuccess}>{successMessage}</div>}

      {/* Google Sign In Button */}
      <button
        type="button"
        className={styles.googleBtn}
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <svg className={styles.googleIcon} viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <span>{activeTab === 'login' ? 'CONTINUE WITH GOOGLE' : 'SIGN UP WITH GOOGLE'}</span>
      </button>

      {/* Divider */}
      <div className={styles.divider}>
        <span>OR CONTINUE WITH EMAIL</span>
      </div>

      {/* LOGIN TAB */}
      {activeTab === 'login' && (
        <form onSubmit={handleLoginSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="login-email">EMAIL ADDRESS</label>
            <input
              type="email"
              id="login-email"
              name="email"
              required
              className={styles.input}
              placeholder="name@example.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="login-password">PASSWORD</label>
            <input
              type="password"
              id="login-password"
              name="password"
              required
              className={styles.input}
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`btn ${styles.submitBtn}`}
            disabled={isLoading}
          >
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>

          <p className={styles.footerText}>
            DON'T HAVE AN ACCOUNT?{' '}
            <button
              type="button"
              className={styles.link}
              onClick={() => handleTabChange('signup')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
            >
              CREATE ONE
            </button>
          </p>
        </form>
      )}

      {/* SIGNUP TAB */}
      {activeTab === 'signup' && (
        <form onSubmit={handleSignupSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="signup-name">FULL NAME</label>
            <input
              type="text"
              id="signup-name"
              name="name"
              required
              className={styles.input}
              placeholder="Your name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="signup-email">EMAIL ADDRESS</label>
            <input
              type="email"
              id="signup-email"
              name="email"
              required
              className={styles.input}
              placeholder="name@example.com"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="signup-password">PASSWORD (MIN 6 CHARACTERS)</label>
            <input
              type="password"
              id="signup-password"
              name="password"
              required
              minLength={6}
              className={styles.input}
              placeholder="••••••••"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="signup-confirm-password">CONFIRM PASSWORD</label>
            <input
              type="password"
              id="signup-confirm-password"
              name="confirmPassword"
              required
              minLength={6}
              className={styles.input}
              placeholder="••••••••"
              value={signupConfirmPassword}
              onChange={(e) => setSignupConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`btn ${styles.submitBtn}`}
            disabled={isLoading}
          >
            {isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </button>

          <p className={styles.footerText}>
            ALREADY HAVE AN ACCOUNT?{' '}
            <button
              type="button"
              className={styles.link}
              onClick={() => handleTabChange('login')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
            >
              SIGN IN
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
