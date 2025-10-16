"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";

import {
  BookOpen,
  CheckSquare,
  Bell,
  BarChart3,
  Trophy,
  Flame,
  Plus,
  Calendar,
  Users,
  Briefcase,
  GraduationCap,
  Timer,
  Upload,
  Play,
  Award,
  TrendingUp,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserRole = "student" | "teacher" | "professional" | "admin";

export default function HomePage() {
  const [userRole] = useState<UserRole>("student"); // This would come from auth/context
  const [taskInput, setTaskInput] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[v0] Adding task:", taskInput);
    setTaskInput("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Good {getTimeOfDay()}, Alex 👋
          </h1>
          <p className="text-muted-foreground">{getRoleMessage(userRole)}</p>
        </div>

        {/* Common Widgets - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Daily Streak */}
          <div
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Daily Streak</h3>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold">12</span>
              <span className="text-muted-foreground mb-1">days</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                style={{ width: "75%" }}
              />
            </div>
          </div>

          {/* XP Points */}
          <div
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">XP Points</h3>
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold">2,450</span>
              <span className="text-green-500 text-sm mb-1">+120 today</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Level 8 - 550 XP to next level</span>
            </div>
          </div>

          {/* Tasks Completed */}
          <div
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Tasks Today</h3>
              <CheckSquare className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold">8</span>
              <span className="text-muted-foreground mb-1">/ 12</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                style={{ width: "67%" }}
              />
            </div>
          </div>

          {/* Leaderboard Rank */}
          <div
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Your Rank</h3>
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold">#3</span>
              <span className="text-muted-foreground mb-1">this week</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-500">
              <TrendingUp className="w-4 h-4" />
              <span>Up 2 positions</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Motivation */}
            <div
              className="bg-card border border-border rounded-xl p-6 animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Daily Motivation</h3>
                <Play className="w-5 h-5 text-primary" />
              </div>
              <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                <Play className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground italic">
                "The secret of getting ahead is getting started." - Mark Twain
              </p>
            </div>

            {/* Quick Add Task */}
            <div
              className="bg-card border border-border rounded-xl p-6 animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              <h3 className="font-semibold text-lg mb-4">Quick Add Task</h3>
              <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="What do you want to accomplish today?"
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </button>
              </form>
            </div>

            {/* Role-Specific Content */}
            {userRole === "student" && <StudentDashboard />}
            {userRole === "teacher" && <TeacherDashboard />}
            {userRole === "professional" && <ProfessionalDashboard />}
            {userRole === "admin" && <AdminDashboard />}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <div
              className="bg-card border border-border rounded-xl p-6 animate-fade-in-up"
              style={{ animationDelay: "0.7s" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Leaderboard</h3>
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Sarah Chen", xp: 3240, avatar: "🥇" },
                  { rank: 2, name: "Mike Johnson", xp: 2890, avatar: "🥈" },
                  { rank: 3, name: "You", xp: 2450, avatar: "🥉", isYou: true },
                  { rank: 4, name: "Emma Davis", xp: 2120, avatar: "👤" },
                  { rank: 5, name: "Alex Kim", xp: 1980, avatar: "👤" },
                ].map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      user.isYou
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="text-2xl">{user.avatar}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.xp} XP
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">
                      #{user.rank}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div
              className="bg-card border border-border rounded-xl p-6 animate-fade-in-up"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Recent Badges</h3>
                <Award className="w-5 h-5 text-purple-500" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    emoji: "🔥",
                    name: "Week Warrior",
                    color: "from-orange-500 to-red-500",
                  },
                  {
                    emoji: "⚡",
                    name: "Speed Demon",
                    color: "from-yellow-500 to-orange-500",
                  },
                  {
                    emoji: "🎯",
                    name: "Goal Crusher",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    emoji: "📚",
                    name: "Bookworm",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    emoji: "🌟",
                    name: "Rising Star",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    emoji: "💪",
                    name: "Consistent",
                    color: "from-indigo-500 to-purple-500",
                  },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className={`aspect-square bg-gradient-to-br ${badge.color} rounded-lg flex flex-col items-center justify-center p-2 hover:scale-105 transition-transform cursor-pointer`}
                  >
                    <span className="text-2xl mb-1">{badge.emoji}</span>
                    <span className="text-[10px] text-white font-medium text-center leading-tight">
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Role-specific dashboard components
function StudentDashboard() {
  return (
    <>
      {/* Learning Roadmap */}
      <div
        className="bg-card border border-border rounded-xl p-6 animate-fade-in-up"
        style={{ animationDelay: "0.7s" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Today's Learning Roadmap</h3>
          <BookOpen className="w-5 h-5 text-blue-500" />
        </div>
        <div className="space-y-3">
          {[
            {
              title: "Complete React Hooks Tutorial",
              progress: 75,
              subject: "Web Development",
            },
            {
              title: "Math Assignment - Chapter 5",
              progress: 30,
              subject: "Mathematics",
            },
            {
              title: 'Read "Clean Code" - Pages 50-80',
              progress: 0,
              subject: "Computer Science",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 bg-background rounded-lg border border-border hover:border-blue-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.subject}
                  </p>
                </div>
                <span className="text-xs font-semibold text-blue-500">
                  {item.progress}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My To-Do List */}
      <div
        className="bg-card border border-border rounded-xl p-6 animate-fade-in-up"
        style={{ animationDelay: "0.8s" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">My To-Do List</h3>
          <CheckSquare className="w-5 h-5 text-green-500" />
        </div>
        <div className="space-y-2">
          {[
            { task: "Submit project proposal", done: true, priority: "high" },
            { task: "Review lecture notes", done: true, priority: "medium" },
            { task: "Practice coding problems", done: false, priority: "high" },
            {
              task: "Group study session at 4 PM",
              done: false,
              priority: "medium",
            },
            { task: "Update portfolio website", done: false, priority: "low" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:border-green-500/50 transition-colors"
            >
              <Input
                type="checkbox"
                checked={item.done}
                className="w-4 h-4 rounded border-border"
                readOnly
              />
              <span
                className={`flex-1 text-sm ${
                  item.done ? "line-through text-muted-foreground" : ""
                }`}
              >
                {item.task}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  item.priority === "high"
                    ? "bg-red-500/10 text-red-500"
                    : item.priority === "medium"
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-blue-500/10 text-blue-500"
                }`}
              >
                {item.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function TeacherDashboard() {
  return (
    <>
      {/* Class Schedule */}
      <div
        className="bg-card border border-border rounded-xl p-6 animate-fade-in-up"
        style={{ animationDelay: "0.7s" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Today's Classes</h3>
          <Calendar className="w-5 h-5 text-indigo-500" />
        </div>
        <div className="space-y-3">
          {[
            {
              time: "9:00 AM",
              class: "Mathematics 101",
              room: "Room 204",
              students: 28,
            },
            {
              time: "11:00 AM",
              class: "Advanced Calculus",
              room: "Room 305",
              students: 22,
            },
            {
              time: "2:00 PM",
              class: "Statistics",
              room: "Room 204",
              students: 30,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 bg-background rounded-lg border border-border hover:border-indigo-500/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{item.class}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.room} • {item.students} students
                  </p>
                </div>
                <span className="text-sm font-semibold text-indigo-500">
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Progress Overview */}
      <div
        className="bg-card border border-border rounded-xl p-6 animate-fade-in-up"
        style={{ animationDelay: "0.8s" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Student Progress</h3>
          <Users className="w-5 h-5 text-purple-500" />
        </div>
        <div className="space-y-3">
          {[
            { class: "Mathematics 101", avgScore: 85, completion: 92 },
            { class: "Advanced Calculus", avgScore: 78, completion: 88 },
            { class: "Statistics", avgScore: 91, completion: 95 },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 bg-background rounded-lg border border-border"
            >
              <p className="font-medium text-sm mb-3">{item.class}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Avg Score
                  </p>
                  <p className="text-lg font-bold text-green-500">
                    {item.avgScore}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Completion
                  </p>
                  <p className="text-lg font-bold text-blue-500">
                    {item.completion}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ProfessionalDashboard() {
  return (
    <>
      {/* Work Dashboard */}
      <div
        className="bg-card border border-border rounded-xl p-6 animate-fade-in-up"
        style={{ animationDelay: "0.7s" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Work Tasks</h3>
          <Briefcase className="w-5 h-5 text-teal-500" />
        </div>
        <div className="space-y-3">
          {[
            {
              title: "Client presentation prep",
              deadline: "2 hours",
              priority: "high",
            },
            {
              title: "Code review - Feature X",
              deadline: "Today",
              priority: "high",
            },
            {
              title: "Team meeting notes",
              deadline: "Tomorrow",
              priority: "medium",
            },
            {
              title: "Update documentation",
              deadline: "This week",
              priority: "low",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 bg-background rounded-lg border border-border hover:border-teal-500/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {item.deadline}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    item.priority === "high"
                      ? "bg-red-500/10 text-red-500"
                      : item.priority === "medium"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {item.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Tracker */}
      <div
        className="bg-card border border-border rounded-xl p-6 animate-fade-in-up"
        style={{ animationDelay: "0.8s" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Learning Progress</h3>
          <GraduationCap className="w-5 h-5 text-purple-500" />
        </div>
        <div className="space-y-3">
          {[
            { course: "AWS Solutions Architect", progress: 65, hours: 12 },
            { course: "Advanced TypeScript", progress: 40, hours: 8 },
            { course: "System Design Fundamentals", progress: 25, hours: 5 },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 bg-background rounded-lg border border-border"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{item.course}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.hours} hours completed
                  </p>
                </div>
                <span className="text-xs font-semibold text-purple-500">
                  {item.progress}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pomodoro Widget */}
      <div
        className="bg-card border border-border rounded-xl p-6 animate-fade-in-up"
        style={{ animationDelay: "0.9s" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Focus Timer</h3>
          <Timer className="w-5 h-5 text-red-500" />
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold mb-4">25:00</div>
          <button className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Play className="w-5 h-5" />
            Start Focus Session
          </button>
          <p className="text-xs text-muted-foreground mt-3">
            4 sessions completed today
          </p>
        </div>
      </div>
    </>
  );
}

function AdminDashboard() {
  return (
    <>
      {/* Upload Motivation Content */}
      <div
        className="bg-card border border-border rounded-xl p-6 animate-fade-in-up"
        style={{ animationDelay: "0.7s" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Upload Motivation Content</h3>
          <Upload className="w-5 h-5 text-blue-500" />
        </div>
        <div className="space-y-3">
          <button className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-blue-500 transition-colors text-sm text-muted-foreground">
            Click to upload video
          </button>
          <input
            type="text"
            placeholder="Enter motivational quote"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Publish Content
          </button>
        </div>
      </div>

      {/* User Management */}
      <div
        className="bg-card border border-border rounded-xl p-6 animate-fade-in-up"
        style={{ animationDelay: "0.8s" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">User Statistics</h3>
          <Users className="w-5 h-5 text-purple-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { role: "Students", count: 1248, color: "text-blue-500" },
            { role: "Teachers", count: 89, color: "text-indigo-500" },
            { role: "Professionals", count: 456, color: "text-teal-500" },
            { role: "Active Today", count: 892, color: "text-green-500" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 bg-background rounded-lg border border-border"
            >
              <p className="text-xs text-muted-foreground mb-1">{item.role}</p>
              <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div
        className="bg-card border border-border rounded-xl p-6 animate-fade-in-up"
        style={{ animationDelay: "0.9s" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Engagement Metrics</h3>
          <BarChart3 className="w-5 h-5 text-green-500" />
        </div>
        <div className="space-y-4">
          {[
            { metric: "Avg Daily Streak", value: "8.5 days", change: "+12%" },
            { metric: "Tasks Completed", value: "12.4K", change: "+8%" },
            { metric: "Active Users", value: "892", change: "+15%" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.metric}</p>
                <p className="text-xs text-muted-foreground">{item.value}</p>
              </div>
              <span className="text-sm font-semibold text-green-500">
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Helper functions
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

function getRoleMessage(role: UserRole) {
  const messages = {
    student: "Let's crush your learning goals today!",
    teacher: "Ready to inspire your students today?",
    professional: "Time to balance work and learning!",
    admin: "Manage your platform and empower users.",
  };
  return messages[role];
}
