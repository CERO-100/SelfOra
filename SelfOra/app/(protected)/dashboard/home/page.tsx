"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Clock,
  Target,
  Flame,
  Star,
  Coins,
  Menu,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  fetchLearningVideos,
  fetchRandomQuote,
  LearningVideo,
  MotivationalQuote,
} from "@/lib/api";
import { Button } from "@/components/tiptap-ui-primitive/button/button";

type UserRole = "student" | "teacher" | "professional";

export default function HomePage() {
  const [userRole] = useState<UserRole>("student");
  const [currentDate] = useState(new Date(2025, 8, 5)); // Sep 5, 2025 (Friday)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [learningVideos, setLearningVideos] = useState<LearningVideo[]>([]);
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Generate calendar dates
  const generateCalendarDates = () => {
    const dates = [];
    for (let i = 0; i < 15; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const calendarDates = generateCalendarDates();
  const daysWithActivity = [1, 2, 4, 9, 10]; // Indices of dates with green dots

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [videos, quote] = await Promise.all([
          fetchLearningVideos(),
          fetchRandomQuote(),
        ]);
        setLearningVideos(videos);
        setCurrentQuote(quote);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}

      {/* Main Content - with dynamic left margin based on sidebar state */}
      <div>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Side (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Your Schedule Section */}
              <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm border border-border">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                      Your Schedule
                    </h2>
                    <HelpCircle className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <button
                    onClick={() => setIsCalendarOpen(true)}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Calendar</span>
                  </button>
                </div>

                {/* Date Display */}
                <p className="text-muted-foreground mb-6">
                  {currentDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                {/* Calendar Strip */}
                <div className="relative mb-6">
                  <Button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 w-8 h-8 bg-card rounded-full shadow-md flex items-center justify-center hover:bg-muted transition-colors border border-border">
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </Button>

                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {calendarDates.map((date, index) => {
                      const isToday = index === 0;
                      const hasActivity = daysWithActivity.includes(index);
                      return (
                        <div
                          key={index}
                          className={`flex-shrink-0 w-14 sm:w-16 flex flex-col items-center gap-2 py-3 rounded-xl transition-all cursor-pointer ${
                            isToday
                              ? "bg-primary/10 border-2 border-primary"
                              : "hover:bg-muted"
                          }`}
                        >
                          <span className="text-xs font-medium text-muted-foreground uppercase">
                            {date.toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </span>
                          <span
                            className={`text-lg font-semibold ${
                              isToday ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {date.getDate()}
                          </span>
                          {hasActivity && (
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <Button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 w-8 h-8 bg-card rounded-full shadow-md flex items-center justify-center hover:bg-muted transition-colors border border-border">
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>

                {/* Alert Banner */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
                  <p className="text-sm text-foreground">
                    Learning content of next Growth Cycle will unlock once you
                    complete all the{" "}
                    <Link
                      href="#"
                      className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700"
                    >
                      assignments
                    </Link>{" "}
                    in the current Growth Cycle.
                  </p>
                </div>

                {/* Learning Module Card */}
                <div className="bg-gradient-to-r from-amber-100 via-pink-100 to-purple-200 dark:from-amber-900/30 dark:via-pink-900/30 dark:to-purple-900/30 rounded-2xl p-4 sm:p-6 mb-6">
                  {isLoading ? (
                    <div className="aspect-video rounded-xl bg-background/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : learningVideos.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-foreground">
                        {learningVideos[0].title}
                      </h3>
                      {learningVideos[0].description && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {learningVideos[0].description}
                        </p>
                      )}
                      <iframe
                        className="aspect-video w-full rounded-xl"
                        src={learningVideos[0].video_url}
                        title={learningVideos[0].title}
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <iframe
                      className="aspect-video w-full rounded-xl"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    />
                  )}
                </div>

                {/* Motivational Quote */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-background/20 rounded w-3/4"></div>
                    </div>
                  ) : currentQuote ? (
                    <div>
                      <p className="text-sm text-foreground italic">
                        "{currentQuote.quote_text}"
                      </p>
                      {currentQuote.author && (
                        <p className="text-xs text-muted-foreground mt-2 text-right">
                          — {currentQuote.author}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-foreground">
                      "Stay focused and keep learning!"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Right Side (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">
              {/* User Profile Card */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src="/spider.jpg"
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Tito
                    </h3>
                    <button className="flex items-center gap-2 text-sm">
                      <Flame className="w-4 h-4" />
                      <span>Daily Rank --</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  4th October 2025
                </p>
              </div>

              {/* Achievements Section */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Achievements
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Best:</span>
                      <span className="font-semibold text-green-600">🔥90</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Goal:</span>
                      <span className="font-semibold text-orange-600">🎯7</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {/* Streaks */}
                  <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-3 sm:p-4 text-center">
                    <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                      91
                    </p>
                    <p className="text-xs text-muted-foreground">Streaks</p>
                  </div>

                  {/* Points */}
                  <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-3 sm:p-4 text-center">
                    <Star className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                      63,802
                    </p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>

                  {/* Coins */}
                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3 sm:p-4 text-center">
                    <Coins className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                      17,610
                    </p>
                    <p className="text-xs text-muted-foreground">Coins</p>
                  </div>
                </div>

                <Link
                  href="/leaderboard"
                  className="w-full py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-medium text-center transition-colors flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  View Leaderboard
                </Link>
              </div>

              {/* Daily Goal Card */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      Daily Goal
                    </h3>
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                    <Target className="w-4 h-4" />
                    <span>13Hrs Left</span>
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-40 h-40">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        className="text-border"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        className="text-primary"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(0 / 100) * 440} 440`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Star className="w-8 h-8 text-primary mb-2" />
                      <span className="text-2xl font-bold text-foreground">
                        0/100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    Daily Goal Reward
                  </span>
                  <div className="flex items-center gap-1 text-orange-600 font-semibold">
                    <Coins className="w-4 h-4" />
                    <span>50</span>
                  </div>
                </div>
              </div>

              {/* Weekly Goal Card */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      Weekly Goal
                    </h3>
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <Calendar className="w-5 h-5 text-orange-500" />
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-foreground">
                      3/5 Days
                    </span>
                    <span className="text-sm text-muted-foreground">
                      This Week
                    </span>
                  </div>

                  {/* Day Indicators */}
                  <div className="flex justify-between gap-2">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => {
                      const isCompleted = index < 3;
                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-2"
                        >
                          <span className="text-xs text-muted-foreground font-medium">
                            {day}
                          </span>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted
                                ? "bg-blue-500 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? "✓" : "○"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Weekly Goal Reward
                    </span>
                    <div className="flex items-center gap-1 text-orange-600 font-semibold">
                      <Coins className="w-4 h-4" />
                      <span>300</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      No. of Weekly Goals Achieved
                    </span>
                    <span className="text-blue-600 font-semibold">
                      22 Weeks
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
