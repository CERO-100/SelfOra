"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Target,
  TrendingUp,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  S
                </span>
              </div>
              <span className="text-lg sm:text-xl font-semibold">Selfora</span>
            </div>
            <div className="hidden lg:flex items-center gap-6">
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/choose-role">
                <Button size="sm">Get started</Button>
              </Link>
            </div>
            <div className="flex items-center lg:hidden gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4 space-y-3">
              <a
                href="#features"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <div className="pt-2 space-y-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/choose-role">
                  <Button size="sm" className="w-full">
                    Get started
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 md:pt-24 pb-16 sm:pb-24 md:pb-32">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6 text-balance">
            Stop procrastinating.
            <br />
            Start learning.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-2xl text-pretty">
            Build consistent learning habits with Selfora. The platform designed
            for students, professionals, and teachers who want to overcome
            procrastination and achieve their learning goals.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link href="/choose-role">
              <Button size="lg" className="text-base w-full sm:w-auto">
                Get started for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-base bg-transparent w-full sm:w-auto"
            >
              See how it works
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="border-l-2 border-primary pl-4 sm:pl-6">
              <div className="text-3xl sm:text-4xl font-bold mb-2">85%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Improved consistency
              </div>
            </div>
            <div className="border-l-2 border-primary pl-4 sm:pl-6">
              <div className="text-3xl sm:text-4xl font-bold mb-2">3x</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Faster goal completion
              </div>
            </div>
            <div className="border-l-2 border-primary pl-4 sm:pl-6">
              <div className="text-3xl sm:text-4xl font-bold mb-2">10k+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Active learners
              </div>
            </div>
            <div className="border-l-2 border-primary pl-4 sm:pl-6">
              <div className="text-3xl sm:text-4xl font-bold mb-2">92%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Reduced procrastination
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32"
      >
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Everything you need to stay consistent
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty">
            Powerful features designed to help you build lasting learning habits
            and overcome procrastination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              Goal Tracking
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Set clear learning goals and track your progress with intuitive
              visualizations. Stay motivated with milestone celebrations.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              Habit Streaks
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Build momentum with daily streaks. Visual feedback keeps you
              accountable and motivated to maintain consistency.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              Smart Reminders
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Intelligent notifications that adapt to your schedule. Never miss
              a learning session without feeling overwhelmed.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              Accountability Partners
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Connect with peers who share your learning goals. Support each
              other and celebrate wins together.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              Progress Analytics
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Detailed insights into your learning patterns. Understand what
              works and optimize your study routine.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              Learning Journal
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Document your learning journey with a Notion-style editor. Reflect
              on progress and capture insights.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
          <div className="mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Simple process. Powerful results.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty">
              Get started in minutes and build lasting learning habits that
              stick.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-3 sm:mb-4">
                01
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
                Set your goals
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Define what you want to learn and break it down into manageable
                milestones. Our guided setup helps you create realistic,
                achievable goals.
              </p>
            </div>

            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-3 sm:mb-4">
                02
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
                Build your routine
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Create a consistent learning schedule that fits your lifestyle.
                Set reminders and track your daily progress with ease.
              </p>
            </div>

            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-3 sm:mb-4">
                03
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
                Stay accountable
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Monitor your streaks, celebrate milestones, and connect with
                accountability partners. Watch your consistency transform into
                results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 sm:p-12 md:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Ready to stop procrastinating?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-pretty">
            Join thousands of learners who have transformed their self-learning
            journey with Selfora.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Link href="/choose-role">
              <Button size="lg" className="text-base w-full sm:w-auto">
                Start learning today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-base bg-transparent w-full sm:w-auto"
            >
              View pricing
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
            Free for 14 days. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    S
                  </span>
                </div>
                <span className="text-xl font-semibold">Selfora</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Build consistent learning habits and overcome procrastination.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 Selfora. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                LinkedIn
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
