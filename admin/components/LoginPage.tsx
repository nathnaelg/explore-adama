import React, { useState } from 'react';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { api } from '../services/api';
import { useAuth } from './AuthProvider';

interface LoginPageProps {
  onLogin?: (userData?: any) => void;
  onForgotClick?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onForgotClick }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
        setError("Please enter both email and password.");
        setIsLoading(false);
        return;
    }

    try {
      const res = await api.post<any>('/auth/login', {
        email,
        password
      });

      const { user, accessToken, refreshToken } = res;

      if (!user || !accessToken) {
          throw new Error("Invalid server response.");
      }

      const isBanned = user.banned === true || String(user.banned) === 'true';
      if (isBanned) {
          setError("Access Denied: Your account has been suspended.");
          setIsLoading(false);
          return;
      }

      if (user.role !== 'ADMIN') {
          setError("Access Denied: You do not have administrator privileges.");
          setIsLoading(false);
          return;
      }

      api.setToken(accessToken);
      if (refreshToken) {
          api.setRefreshToken(refreshToken);
      }
      api.setUser(user);
      
      login(user);
      if (onLogin) onLogin(user);

    } catch (err: any) {
      console.error(err);
      let msg = "Login failed. Please check your credentials.";
      if (err.response) {
          if (err.response.status >= 500) {
              msg = "Something went wrong. Please try again later.";
          } else {
              msg = err.response.data?.message || msg;
          }
      } else if (err.request) {
          msg = "Something went wrong. Please check your connection or try again later.";
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-black transition-colors duration-300">
      
      {/* Left: Visual Side */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-slate-900/90 z-10 mix-blend-multiply" />
          <img 
            src="../../public/adama3.jpg" 
            alt="City Night" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          
          <div className="relative z-20 flex flex-col justify-between p-12 h-full text-white">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/40">E</div>
                  <span className="text-xl font-bold tracking-tight">explore-adama Admin portal</span>
              </div>

              <div className="max-w-lg space-y-4 mb-12">
                  <blockquote className="text-2xl font-medium leading-relaxed">
                      "Transforming urban management with real-time data and AI-driven insights for a smarter future."
                  </blockquote>
                  <div className="flex items-center gap-2">
                      <div className="h-px w-8 bg-blue-500"></div>
                      <p className="text-sm text-blue-200">System V 2.0</p>
                  </div>
              </div>
          </div>
      </div>

      {/* Right: Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
          
          <div className="w-full max-w-md space-y-8">
              
              <div className="text-center lg:text-left space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back</h1>
                  <p className="text-gray-500 dark:text-zinc-400">Enter your credentials to access the admin dashboard.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-zinc-300">Email Address</Label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input 
                                id="email" 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 h-11 bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 transition-all"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-gray-700 dark:text-zinc-300">Password</Label>
                            <button 
                                type="button"
                                onClick={onForgotClick}
                                className="text-sm text-blue-500 hover:underline font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input 
                                id="password" 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 pr-10 h-11 bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 transition-all"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm font-medium flex items-start gap-2 animate-in slide-in-from-top-1 fade-in">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" /> 
                    <span>{error}</span>
                  </div>
                )}

                <Button 
                    type="submit" 
                    className="w-full h-11 text-base font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all" 
                    disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign In'}
                </Button>
              </form>
          </div>

          <div className="absolute bottom-6 left-0 w-full text-center text-xs text-gray-400 lg:hidden">
              &copy; 2024 Adama City Administration
          </div>
      </div>
    </div>
  );
};

export default LoginPage;