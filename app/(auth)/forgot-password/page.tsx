"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, KeyRound, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div className="absolute inset-0 opacity-30"style={{ backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--muted-foreground) / 0.15) 1px, transparent 0)`, backgroundSize: "32px 32px", }}/>
      {/* Navigation */}
      <nav className="relative border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="h-4 w-4" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    S
                  </span>
                </div>
                <span className="text-lg sm:text-xl font-semibold">
                  Selfora
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Forgot Password Form */}
      <div className="relative flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 animate-in zoom-in duration-500">
                  <KeyRound className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                  Reset your password
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
                  Enter your email address and we'll send you a link to reset
                  your password
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div className="space-y-2 animate-in fade-in slide-in-from-left duration-500 delay-400">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-base animate-in fade-in slide-in-from-bottom duration-500 delay-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending reset link...
                      </span>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center animate-in fade-in duration-500 delay-600">
                  <p className="text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>

              {/* Security Note */}
              <p className="text-xs text-center text-muted-foreground mt-6 px-4 animate-in fade-in duration-500 delay-700">
                For security reasons, password reset links expire after 1 hour
              </p>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-2xl mb-4 animate-in zoom-in duration-500">
                  <CheckCircle2 className="h-8 w-8 text-green-500 animate-in zoom-in duration-700 delay-200" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                  Check your email
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
                  We've sent a password reset link to
                </p>
                <p className="text-foreground font-medium mt-2 animate-in fade-in duration-700 delay-300">
                  {email}
                </p>
              </div>

              {/* Success Card */}
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-700 delay-400">
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p className="animate-in fade-in duration-500 delay-500">
                    Click the link in the email to reset your password. If you
                    don't see the email, check your spam folder.
                  </p>
                  <div className="pt-4 border-t border-border animate-in fade-in duration-500 delay-600">
                    <p className="mb-4">Didn't receive the email?</p>
                    <Button
                      variant="outline"
                      className="w-full transition-all hover:scale-[1.02] active:scale-[0.98] bg-transparent"
                      onClick={() => setIsSuccess(false)}
                    >
                      Try another email address
                    </Button>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center animate-in fade-in duration-500 delay-700">
                  <Link
                    href="/login"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
