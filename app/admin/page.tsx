"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Video,
  Quote,
  Trophy,
  Settings,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FileText,
  MessageCircle,
  Bell,
  ChevronDown,
  Download,
  Upload,
  Calendar,
  Activity,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/tiptap-ui-primitive/button/button";

interface User {
  id: number;
  username: string;
  email: string;
  date_joined: string;
  is_active: boolean;
}

interface LearningVideo {
  id: number;
  title: string;
  description: string;
  video_url: string;
  is_active: boolean;
  order: number;
  created_at: string;
}

interface MotivationalQuote {
  id: number;
  quote_text: string;
  author: string;
  is_active: boolean;
  order: number;
  created_at: string;
}

interface Template {
  id: number;
  name: string;
  type: string;
  description: string;
  content: any;
  is_active: boolean;
  is_default: boolean;
  order: number;
  created_at: string;
}

interface UserFeedback {
  id: number;
  user_username: string;
  user_email: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  admin_notes: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [videos, setVideos] = useState<LearningVideo[]>([]);
  const [quotes, setQuotes] = useState<MotivationalQuote[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mongoTemplates, setMongoTemplates] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Please login as admin to access this page");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (activeTab === "users") {
        const response = await fetch("http://localhost:8000/admin/users/", {
          headers,
        });
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          setError(data.message || "Failed to fetch users");
        }
      } else if (activeTab === "videos") {
        const response = await fetch("http://localhost:8000/admin/videos/", {
          headers,
        });
        const data = await response.json();
        if (data.success) {
          setVideos(data.data);
        } else {
          setError(data.message || "Failed to fetch videos");
        }
      } else if (activeTab === "quotes") {
        const response = await fetch("http://localhost:8000/admin/quotes/", {
          headers,
        });
        const data = await response.json();
        if (data.success) {
          setQuotes(data.data);
        } else {
          setError(data.message || "Failed to fetch quotes");
        }
      } else if (activeTab === "templates") {
        const response = await fetch("http://localhost:8000/admin/templates/", {
          headers,
        });
        const data = await response.json();
        if (data.success) {
          setTemplates(data.data);
        } else {
          setError(data.message || "Failed to fetch templates");
        }
      } else if (activeTab === "feedback") {
        const response = await fetch("http://localhost:8000/admin/feedback/", {
          headers,
        });
        const data = await response.json();
        if (data.success) {
          setFeedback(data.data);
        } else {
          setError(data.message || "Failed to fetch feedback");
        }
      } else if (activeTab === "mongo-templates") {
        const response = await fetch("http://localhost:8000/mongo-templates/", {
          headers,
        });
        const data = await response.json();
        if (data.success) {
          setMongoTemplates(data.data);
        } else {
          setError(data.message || "Failed to fetch MongoDB templates");
        }
      }
    } catch (err) {
      setError("Network error: Please check if the server is running");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const initializeTemplates = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "http://localhost:8000/initialize-templates/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setError("");
        fetchData(); // Refresh templates
        alert(`Successfully initialized ${data.data.length} templates`);
      } else {
        setError(data.message || "Failed to initialize templates");
      }
    } catch (err) {
      setError("Failed to initialize templates");
    }
  };

  const sidebarItems = [
    { id: "users", label: "Users", icon: Users, count: users.length },
    {
      id: "videos",
      label: "Learning Videos",
      icon: Video,
      count: videos.length,
    },
    {
      id: "quotes",
      label: "Motivational Quotes",
      icon: Quote,
      count: quotes.length,
    },
    {
      id: "templates",
      label: "Django Templates",
      icon: FileText,
      count: templates.length,
    },
    {
      id: "mongo-templates",
      label: "Notion Templates",
      icon: FileText,
      count: mongoTemplates.length,
    },
    {
      id: "feedback",
      label: "User Feedback",
      icon: MessageCircle,
      count: feedback.length,
    },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        {/* Logo & Brand */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Selfora</h1>
              <p className="text-sm text-slate-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-100 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className={`${
                      isActive
                        ? "text-blue-600"
                        : "text-slate-500 group-hover:text-slate-700"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Profile */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Admin User</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 capitalize tracking-tight">
                {activeTab.replace("-", " ")}
              </h2>
              <p className="text-slate-600 mt-1 text-lg">
                Manage your {activeTab.replace("-", " ")} efficiently
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 w-80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                  <Bell size={20} />
                </Button>
                <Button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
                  <Plus size={20} />
                  Add New
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 bg-slate-50">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Users"
              value={users.length.toString()}
              change="+12%"
              icon={Users}
              color="blue"
            />
            <StatsCard
              title="Active Videos"
              value={videos.filter((v) => v.is_active).length.toString()}
              change="+5%"
              icon={Video}
              color="purple"
            />
            <StatsCard
              title="Quotes"
              value={quotes.length.toString()}
              change="+8%"
              icon={Quote}
              color="emerald"
            />
            <StatsCard
              title="Templates"
              value={(templates.length + mongoTemplates.length).toString()}
              change="+15%"
              icon={FileText}
              color="orange"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              {error}
            </div>
          )}

          {/* Content Tables */}
          {loading ? (
            <div className="flex items-center justify-center h-96 bg-white rounded-2xl shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-600 font-medium">Loading...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {activeTab === "users" && <UsersTable users={users} />}
              {activeTab === "videos" && <VideosTable videos={videos} />}
              {activeTab === "quotes" && <QuotesTable quotes={quotes} />}
              {activeTab === "templates" && (
                <TemplatesTable templates={templates} />
              )}
              {activeTab === "feedback" && (
                <FeedbackTable feedback={feedback} />
              )}
              {activeTab === "mongo-templates" && (
                <MongoTemplatesTable
                  templates={mongoTemplates}
                  onInitialize={initializeTemplates}
                />
              )}
              {activeTab === "leaderboard" && <LeaderboardView />}
              {activeTab === "settings" && <SettingsView />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 bg-blue-50 text-blue-600",
    purple: "from-purple-500 to-purple-600 bg-purple-50 text-purple-600",
    emerald: "from-emerald-500 to-emerald-600 bg-emerald-50 text-emerald-600",
    orange: "from-orange-500 to-orange-600 bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={16} className="text-emerald-500" />
            <span className="text-emerald-600 text-sm font-medium">
              {change}
            </span>
            <span className="text-slate-500 text-sm">from last month</span>
          </div>
        </div>
        <div
          className={`p-4 rounded-2xl bg-gradient-to-br ${
            colorClasses[color as keyof typeof colorClasses].split(" ")[0]
          } ${colorClasses[color as keyof typeof colorClasses].split(" ")[1]}`}
        >
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}

// Enhanced Users Table Component
function UsersTable({ users }: { users: User[] }) {
  return (
    <div className="overflow-hidden">
      {/* Table Header */}
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            User Management
          </h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors">
              <Download size={16} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left py-4 px-8 font-semibold text-slate-700 text-sm">
                User
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Email
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Joined
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Status
              </th>
              <th className="text-left py-4 px-8 font-semibold text-slate-700 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                  index === users.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="py-4 px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-lg">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {user.username}
                      </p>
                      <p className="text-sm text-slate-500">
                        User ID: {user.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-600">{user.email}</td>
                <td className="py-4 px-4 text-slate-600">
                  {new Date(user.date_joined).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-4 px-8">
                  <div className="flex items-center gap-2">
                    <Button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={16} />
                    </Button>
                    <Button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </Button>
                    <Button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Enhanced Videos Table Component
function VideosTable({ videos }: { videos: LearningVideo[] }) {
  return (
    <div className="overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Learning Videos
          </h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors">
              <Upload size={16} />
              Upload Video
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left py-4 px-8 font-semibold text-slate-700 text-sm">
                Title
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Description
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Order
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Status
              </th>
              <th className="text-left py-4 px-8 font-semibold text-slate-700 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video, index) => (
              <tr
                key={video.id}
                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                  index === videos.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="py-4 px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                      <Video size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {video.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        Video ID: {video.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-600 max-w-xs">
                  <p className="truncate">
                    {video.description || "No description"}
                  </p>
                </td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    {video.order}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      video.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {video.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-4 px-8">
                  <div className="flex items-center gap-2">
                    <Button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={16} />
                    </Button>
                    <Button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </Button>
                    <Button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Enhanced Quotes Table Component
function QuotesTable({ quotes }: { quotes: MotivationalQuote[] }) {
  return (
    <div className="overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Motivational Quotes
          </h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors">
              <Download size={16} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left py-4 px-8 font-semibold text-slate-700 text-sm">
                Quote
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Author
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Order
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Status
              </th>
              <th className="text-left py-4 px-8 font-semibold text-slate-700 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote, index) => (
              <tr
                key={quote.id}
                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                  index === quotes.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="py-4 px-8 max-w-md">
                  <p className="text-slate-900 truncate">{quote.quote_text}</p>
                </td>
                <td className="py-4 px-4 text-slate-600">
                  {quote.author || "Unknown"}
                </td>
                <td className="py-4 px-4 text-slate-600">{quote.order}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      quote.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {quote.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-4 px-8">
                  <div className="flex items-center gap-2">
                    <Button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={16} />
                    </Button>
                    <Button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </Button>
                    <Button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Enhanced Templates Table Component
function TemplatesTable({ templates }: { templates: Template[] }) {
  return (
    <div className="overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Django Templates
          </h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors">
              <Download size={16} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left py-4 px-8 font-semibold text-slate-700 text-sm">
                Name
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Type
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Description
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Status
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Default
              </th>
              <th className="text-left py-4 px-8 font-semibold text-slate-700 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template, index) => (
              <tr
                key={template.id}
                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                  index === templates.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="py-4 px-8 font-medium text-slate-900">
                  {template.name}
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {template.type.replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                  {template.description || "No description"}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      template.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {template.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {template.is_default && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                      Default
                    </span>
                  )}
                </td>
                <td className="py-4 px-8">
                  <div className="flex items-center gap-2">
                    <Button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={16} />
                    </Button>
                    <Button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </Button>
                    <Button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Enhanced Feedback Table Component
function FeedbackTable({ feedback }: { feedback: UserFeedback[] }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            User Feedback
          </h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors">
              <Download size={16} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left py-4 px-8 font-semibold text-slate-700 text-sm">
                Title
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                User
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Type
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Priority
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Status
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Date
              </th>
              <th className="text-left py-4 px-8 font-semibold text-slate-700 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                  index === feedback.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="py-4 px-8 font-medium text-slate-900 max-w-xs truncate">
                  {item.title}
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div className="text-slate-900 font-medium">
                      {item.user_username}
                    </div>
                    <div className="text-slate-500 text-sm">
                      {item.user_email}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    {item.type.replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      item.priority
                    )}`}
                  >
                    {item.priority.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status.replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-600">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="py-4 px-8">
                  <div className="flex items-center gap-2">
                    <Button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={16} />
                    </Button>
                    <Button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Leaderboard View Component
function LeaderboardView() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Leaderboard Management
      </h3>
      <p className="text-gray-600">
        Leaderboard functionality will be implemented here.
      </p>
    </div>
  );
}

// Settings View Component
function SettingsView() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Platform Settings
      </h3>
      <p className="text-gray-600">
        Settings configuration will be implemented here.
      </p>
    </div>
  );
}

// Enhanced MongoDB Templates Table Component
function MongoTemplatesTable({
  templates,
  onInitialize,
}: {
  templates: any[];
  onInitialize: () => void;
}) {
  return (
    <div className="overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Notion-like Templates
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Rich content templates stored in MongoDB
            </p>
          </div>
          <button
            onClick={onInitialize}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Initialize Default Templates
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left py-4 px-8 font-semibold text-slate-700 text-sm">
                Template
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Type
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Category
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Blocks
              </th>
              <th className="text-left py-4 px-4 font-semibold text-slate-700 text-sm">
                Status
              </th>
              <th className="text-left py-4 px-8 font-semibold text-slate-700 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template, index) => (
              <tr
                key={template.id}
                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                  index === templates.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="py-4 px-8">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{template.icon || "📄"}</div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {template.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-full text-xs font-semibold">
                    {template.type.replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-xs font-semibold">
                    {template.metadata?.category || "General"}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-slate-400" />
                    <span className="text-slate-600 font-medium">
                      {template.content?.blocks?.length || 0} blocks
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      template.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {template.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-4 px-8">
                  <div className="flex items-center gap-2">
                    <Button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={16} />
                    </Button>
                    <Button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </Button>
                    <Button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
