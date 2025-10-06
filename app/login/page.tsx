"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/lib/api"; // Axios instance
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // ✅ Correct login endpoint
      const res = await API.post("/login/", {
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 200) {
        const { access, refresh } = res.data.token;
        const user = res.data.user;
        toast.success("Login successful!");
        // Save token and user info in localStorage
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("user", JSON.stringify(user));
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      toast.error("Login failed. Please check your credentials.");
      if (err.response?.status === 400) {
        alert(err.response.data.detail || "Invalid email or password.");
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--muted-foreground) / 0.15) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Navbar */}
      <nav className="relative border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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
              <span className="text-lg sm:text-xl font-semibold">Selfora</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="relative flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 animate-in zoom-in duration-500">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Continue your learning journey
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-6 px-4">
            Protected by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}
