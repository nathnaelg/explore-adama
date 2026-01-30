'use client';

import React, { useState } from 'react';
import { Mail, Lock, Loader2, KeyRound, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { api } from '@/services/api';
import ErrorAlert from '@/components/ErrorAlert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await api.requestPasswordReset(email);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset code. Please check the email provided.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
    }

    if (code.length !== 6) {
        setError("Please enter a valid 6-digit verification code.");
        setIsLoading(false);
        return;
    }

    try {
      await api.resetPassword({ email, code, newPassword });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid code or reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-4">
              <Card className="max-w-md w-full text-center p-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 mx-auto rounded-full flex items-center justify-center mb-6">
                      <CheckCircle size={32} />
                  </div>
                  <CardTitle className="text-2xl mb-2">Password Reset Successful</CardTitle>
                  <CardDescription>Your security credentials have been updated. Redirecting you to login...</CardDescription>
                  <Button className="mt-8 w-full" onClick={() => router.push('/login')}>Go to Login Now</Button>
              </Card>
          </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-4 transition-colors duration-300">
      <Card className="max-w-md w-full border-none shadow-2xl">
        <CardHeader className="space-y-2">
            <Link href="/login" className="text-xs text-gray-500 flex items-center gap-1 hover:text-blue-500 transition-colors w-fit mb-2">
                <ArrowLeft size={14} /> Back to Sign In
            </Link>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-2 shadow-lg shadow-blue-500/20">
                {step === 1 ? <KeyRound size={24} /> : <CheckCircle size={24} />}
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
                {step === 1 ? "Reset Password" : "Verification"}
            </CardTitle>
            <CardDescription>
                {step === 1 
                    ? "Enter your email address and we'll send you a 6-digit code to reset your password." 
                    : "We've sent a 6-digit code to your email. Please enter it below along with your new password."}
            </CardDescription>
        </CardHeader>
        
        <CardContent>
            {error && <ErrorAlert message={error} onClose={() => setError(null)} className="mb-6" />}
            
            {step === 1 ? (
                <form onSubmit={handleRequestCode} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input 
                                id="email" 
                                type="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="pl-10 h-11"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full h-11 font-bold" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Send Reset Code"}
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="code">Verification Code</Label>
                        <div className="flex justify-between gap-2">
                             <Input 
                                id="code" 
                                required 
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                                className="text-center font-mono text-xl tracking-[0.5em] h-14"
                             />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input 
                                id="newPassword" 
                                type={showPassword ? "text" : "password"} 
                                required 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="pl-10 h-11"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input 
                                id="confirmPassword" 
                                type={showPassword ? "text" : "password"} 
                                required 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pl-10 h-11"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-11 font-bold" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Update Password"}
                    </Button>
                    
                    <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="w-full text-xs text-gray-400 hover:text-blue-500 transition-colors"
                    >
                        Didn't receive a code? Try another email
                    </button>
                </form>
            )}
        </CardContent>
      </Card>
    </div>
  );
}