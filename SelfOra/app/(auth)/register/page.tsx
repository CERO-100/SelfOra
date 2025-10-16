"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Sparkles,
  CheckCircle2,
  X,
} from "lucide-react";

import API from "@/lib/api"; // <- Make sure you created lib/api.ts

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await API.post("/register/", {
        username: formData.name, // match serializer field
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 201 || res.status === 200) {
        setShowSuccess(true);
        setFormData({ name: "", email: "", password: "" }); // clear form
      } else {
        setErrorMessage("Failed to create account. Try again.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data) {
        setErrorMessage(
          err.response.data.detail || "Failed to create account. Try again."
        );
      } else {
        setErrorMessage("Network error. Please check your backend.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--muted-foreground) / 0.15) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

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
                  Log in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Registration Form */}
      <div className="relative flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 animate-in zoom-in duration-500">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
              Start your journey
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
              Join thousands of learners building consistent habits
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2 animate-in fade-in slide-in-from-left duration-500 delay-400">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2 animate-in fade-in slide-in-from-left duration-500 delay-500">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 animate-in fade-in slide-in-from-left duration-500 delay-600">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-base animate-in fade-in slide-in-from-bottom duration-500 delay-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </Button>

              {/* Rest of your design (divider, social buttons, footer, terms) stays the same */}
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6 animate-in zoom-in duration-700 delay-200">
                <CheckCircle2 className="h-10 w-10 text-primary animate-in zoom-in duration-500 delay-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                Welcome to Selfora!
              </h2>
              <p className="text-muted-foreground mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
                Your account has been created successfully.
              </p>
              <Link href={"/login"}>
                <Button
                  className="w-full h-11 transition-all hover:scale-[1.02]"
                  onClick={() => setShowSuccess(false)}
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
