"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, Briefcase, ArrowRight } from "lucide-react";

export default function ChooseRolePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: "student",
      title: "Student",
      description:
        "Build consistent learning habits, track your progress, and overcome procrastination in your studies.",
      icon: GraduationCap,
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/50",
      hoverColor: "hover:border-blue-500",
    },
    {
      id: "teacher",
      title: "Teacher",
      description:
        "Organize your teaching materials, track student progress, and manage your professional development.",
      icon: BookOpen,
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/50",
      hoverColor: "hover:border-green-500",
    },
    {
      id: "professional",
      title: "Professional",
      description:
        "Balance work, learning, and personal growth. Stay consistent with your upskilling and career goals.",
      icon: Briefcase,
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/50",
      hoverColor: "hover:border-purple-500",
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    // Navigate to register page with role parameter after a short delay
    setTimeout(() => {
      router.push(`/register?role=${roleId}`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Header */}
      <header className="relative border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-xl font-semibold hover:opacity-80 transition-opacity"
            >
              Selfora
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Already have an account?{" "}
              <span className="text-foreground font-medium">Log in</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Step 1 of 2
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-balance">
              Choose your role
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Help us personalize your experience by selecting the role that
              best describes you
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`group relative p-8 rounded-2xl border-2 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 text-left animate-in fade-in slide-in-from-bottom-8 ${role.borderColor} ${role.hoverColor}`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Content */}
                  <div className="relative">
                    {/* Icon */}
                    <div className="mb-6 inline-flex p-3 rounded-xl bg-background/50 border border-border/50 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {role.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {role.description}
                    </p>

                    {/* Arrow Icon */}
                    <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Get started</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedRole === role.id && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Text */}
          <p
            className="text-center text-sm text-muted-foreground mt-12 animate-in fade-in duration-1000"
            style={{ animationDelay: "400ms", animationFillMode: "backwards" }}
          >
            Don't worry, you can always change this later in your settings
          </p>
        </div>
      </main>
    </div>
  );
}
