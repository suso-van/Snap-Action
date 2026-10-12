import React, { useState } from 'react';
import { SnapActionLogo } from './SnapActionLogo';
import { AuthUser, AuthProvider } from '../types';
import {
  Shield,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  X,
  Sparkles,
  Check,
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
  onContinueAsGuest?: () => void;
  canDismiss?: boolean;
  onDismiss?: () => void;
  initialMode?: 'signin' | 'signup';
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  canDismiss = false,
  onDismiss,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  // Password strength calculation for sign up
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };

  const passwordStrength = calculatePasswordStrength(password);

  const handleProviderAuth = (provider: AuthProvider) => {
    setLoadingProvider(provider);
    setErrorMessage(null);

    // Simulate authentic provider authentication flow
    setTimeout(() => {
      let mockUser: AuthUser;
      if (provider === 'google') {
        mockUser = {
          id: 'user_google_' + Date.now(),
          name: 'Susovan Chatterjee',
          email: 'chatterjeesusovan2004@gmail.com',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          provider: 'google',
          isLoggedIn: true,
          tier: 'Pro',
        };
      } else if (provider === 'github') {
        mockUser = {
          id: 'user_github_' + Date.now(),
          name: 'Susovan C.',
          email: 'chatterjeesusovan@github.dev',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          provider: 'github',
          isLoggedIn: true,
          tier: 'Pro',
        };
      } else {
        mockUser = {
          id: 'user_facebook_' + Date.now(),
          name: 'Susovan C.',
          email: 'susovan.chatterjee@facebook.com',
          avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
          provider: 'facebook',
          isLoggedIn: true,
          tier: 'Pro',
        };
      }

      setLoadingProvider(null);
      onLoginSuccess(mockUser);
    }, 750);
  };

  const handleEmailFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!password.trim() || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (mode === 'signup' && !agreeTerms) {
      setErrorMessage('Please agree to the Terms of Service to continue');
      return;
    }

    setLoadingProvider('email');

    setTimeout(() => {
      const displayName = mode === 'signup' ? name.trim() : email.split('@')[0];
      const mockUser: AuthUser = {
        id: 'user_email_' + Date.now(),
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email: email.trim(),
        avatarUrl: undefined,
        provider: 'email',
        isLoggedIn: true,
        tier: 'Pro',
      };
      setLoadingProvider(null);
      onLoginSuccess(mockUser);
    }, 700);
  };

  const handleForgotPassword = () => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Enter your email address above to receive reset instructions');
      return;
    }
    setForgotPasswordNotice(true);
    setErrorMessage(null);
    setTimeout(() => {
      setForgotPasswordNotice(false);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070D]/95 backdrop-blur-xl px-4 py-6 overflow-y-auto animate-fadeIn select-none">
      {/* Background radial ambiance */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-600/[0.08] blur-[140px] pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-cyan-500/[0.06] blur-[90px] pointer-events-none" />

      {/* Dismiss Button */}
      {canDismiss && onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#111624] text-[#888] hover:text-white border border-[#1E293B] hover:border-cyan-500/40 transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="relative w-full max-w-md bg-[#090D1A]/95 border border-[#1E293B] rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-md space-y-5 my-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <div className="relative transform transition-transform duration-300 hover:scale-105">
            <SnapActionLogo size="md" withGlow={true} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-300 font-sans">
              {mode === 'signin' ? 'Sign in to SnapAction' : 'Create your account'}
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5 font-sans">
              {mode === 'signin'
                ? 'Welcome back! Sync your screenshot intelligence & history'
                : 'Start turning any screenshot into instant 1-click actions'}
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-[#0F172A] border border-[#1E293B] rounded-2xl">
          <button
            type="button"
            id="tab-signin"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/50 border border-transparent'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            id="tab-signup"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/50 border border-transparent'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Social Authentication Providers (Minimal Logo Buttons) */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Google */}
          <button
            type="button"
            id="btn-auth-google"
            disabled={loadingProvider !== null}
            onClick={() => handleProviderAuth('google')}
            title={mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
            aria-label="Google"
            className="h-11 flex items-center justify-center rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] hover:border-cyan-500/60 hover:shadow-[0_0_16px_rgba(6,182,212,0.2)] transition-all duration-200 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingProvider === 'google' ? (
              <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-5 h-5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                <svg className="w-full h-full" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
            )}
          </button>

          {/* GitHub */}
          <button
            type="button"
            id="btn-auth-github"
            disabled={loadingProvider !== null}
            onClick={() => handleProviderAuth('github')}
            title={mode === 'signin' ? 'Sign in with GitHub' : 'Sign up with GitHub'}
            aria-label="GitHub"
            className="h-11 flex items-center justify-center rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] hover:border-purple-500/60 hover:shadow-[0_0_16px_rgba(168,85,247,0.2)] transition-all duration-200 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingProvider === 'github' ? (
              <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-5 h-5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                <svg className="w-full h-full fill-white" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </div>
            )}
          </button>

          {/* Facebook */}
          <button
            type="button"
            id="btn-auth-facebook"
            disabled={loadingProvider !== null}
            onClick={() => handleProviderAuth('facebook')}
            title={mode === 'signin' ? 'Sign in with Facebook' : 'Sign up with Facebook'}
            aria-label="Facebook"
            className="h-11 flex items-center justify-center rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] hover:border-blue-500/60 hover:shadow-[0_0_16px_rgba(59,130,246,0.2)] transition-all duration-200 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingProvider === 'facebook' ? (
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-5 h-5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                <svg className="w-full h-full fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[#1E293B]" />
          <span className="absolute px-3 bg-[#090D1A] text-[10px] font-medium text-[#64748B] uppercase tracking-wider">
            {mode === 'signin' ? 'or sign in with email' : 'or sign up with email'}
          </span>
        </div>

        {/* Feedback Notices */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {forgotPasswordNotice && (
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <Check className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Password reset link sent to your email!</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailFormSubmit} className="space-y-3">
          {/* Full Name (Sign Up only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type="text"
                  id="input-signup-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] focus:border-cyan-400 text-white text-xs sm:text-sm placeholder-[#64748B] focus:outline-none transition-colors"
                  required={mode === 'signup'}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input
                type="email"
                id="input-auth-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] focus:border-cyan-400 text-white text-xs sm:text-sm placeholder-[#64748B] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-medium text-[#94A3B8]">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="input-auth-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signin' ? '••••••••' : 'At least 6 characters'}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] focus:border-cyan-400 text-white text-xs sm:text-sm placeholder-[#64748B] focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Meter (Sign Up Only) */}
            {mode === 'signup' && password.length > 0 && (
              <div className="mt-1.5 space-y-1">
                <div className="grid grid-cols-4 gap-1 h-1">
                  <div
                    className={`rounded-full transition-all ${
                      passwordStrength >= 1 ? 'bg-red-400' : 'bg-[#1E293B]'
                    }`}
                  />
                  <div
                    className={`rounded-full transition-all ${
                      passwordStrength >= 2 ? 'bg-yellow-400' : 'bg-[#1E293B]'
                    }`}
                  />
                  <div
                    className={`rounded-full transition-all ${
                      passwordStrength >= 3 ? 'bg-cyan-400' : 'bg-[#1E293B]'
                    }`}
                  />
                  <div
                    className={`rounded-full transition-all ${
                      passwordStrength >= 4 ? 'bg-emerald-400' : 'bg-[#1E293B]'
                    }`}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#64748B]">
                  <span>Security strength</span>
                  <span
                    className={
                      passwordStrength >= 4
                        ? 'text-emerald-400 font-medium'
                        : passwordStrength >= 3
                        ? 'text-cyan-400 font-medium'
                        : passwordStrength >= 2
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }
                  >
                    {passwordStrength >= 4
                      ? 'Strong'
                      : passwordStrength >= 3
                      ? 'Good'
                      : passwordStrength >= 2
                      ? 'Fair'
                      : 'Too weak'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mode-specific Checkbox */}
          {mode === 'signin' ? (
            <div className="flex items-center space-x-2 pt-0.5">
              <input
                type="checkbox"
                id="checkbox-remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#0F172A] border-[#334155] text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-cyan-500"
              />
              <label htmlFor="checkbox-remember" className="text-xs text-[#94A3B8] cursor-pointer">
                Remember my login on this device
              </label>
            </div>
          ) : (
            <div className="flex items-start space-x-2 pt-0.5">
              <input
                type="checkbox"
                id="checkbox-terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-3.5 h-3.5 mt-0.5 rounded bg-[#0F172A] border-[#334155] text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-cyan-500"
              />
              <label htmlFor="checkbox-terms" className="text-[11px] text-[#94A3B8] leading-tight cursor-pointer">
                I agree to the SnapAction <span className="text-cyan-400">Terms of Service</span> and <span className="text-cyan-400">Privacy Policy</span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            id="btn-submit-auth"
            disabled={loadingProvider !== null}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingProvider === 'email' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
              </>
            ) : (
              <>
                {mode === 'signin' ? (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Account & Sign Up</span>
                  </>
                )}
              </>
            )}
          </button>
        </form>

        {/* Switch Mode Prompt */}
        <div className="text-center pt-1 border-t border-[#1E293B]/60">
          {mode === 'signin' ? (
            <p className="text-xs text-[#94A3B8]">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                id="link-switch-to-signup"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-xs text-[#94A3B8]">
              Already have an account?{' '}
              <button
                type="button"
                id="link-switch-to-signin"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>

        {/* Guest access option */}
        {onContinueAsGuest && (
          <div className="text-center pt-0.5">
            <button
              type="button"
              id="btn-login-guest"
              onClick={onContinueAsGuest}
              className="text-xs text-[#64748B] hover:text-[#CBD5E1] transition-colors underline underline-offset-4 cursor-pointer"
            >
              Continue as Guest (Local storage only)
            </button>
          </div>
        )}

        {/* Security footnote */}
        <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[#475569] text-center pt-1">
          <Shield className="w-3 h-3 text-[#64748B]" />
          <span>Encrypted 256-bit OAuth & TLS session. Zero password sharing.</span>
        </div>
      </div>
    </div>
  );
};
