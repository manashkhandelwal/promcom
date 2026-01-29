"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { msalInstance, initializeMsal } from "@/lib/msal";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Settings,
  LogOut,
  Bell,
  Search,
  TrendingUp,
  Clock,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      await initializeMsal();
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        router.replace("/login");
      } else {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Get user info from MSAL
  const accounts = msalInstance.getAllAccounts();
  const user = accounts[0];
  const userName = user?.name || "User";
  const userEmail = user?.username || "";
  console.log("Auth callback successful", user);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await msalInstance.logoutRedirect();
  };

  const stats = [
    {
      label: "Active Tasks",
      value: "24",
      icon: CheckSquare,
      color: "blue",
      trend: "+12%",
    },
    {
      label: "Team Members",
      value: "8",
      icon: Users,
      color: "purple",
      trend: "+2",
    },
    {
      label: "Completed",
      value: "156",
      icon: TrendingUp,
      color: "green",
      trend: "+23%",
    },
    {
      label: "Pending",
      value: "12",
      icon: Clock,
      color: "orange",
      trend: "-3",
    },
  ];

  const recentActivities = [
    {
      user: "Sarah Chen",
      action: "completed task",
      item: "Design Review",
      time: "2m ago",
    },
    {
      user: "Mike Johnson",
      action: "added comment on",
      item: "API Integration",
      time: "15m ago",
    },
    {
      user: "Emma Wilson",
      action: "created",
      item: "New Sprint Board",
      time: "1h ago",
    },
    {
      user: "David Lee",
      action: "updated",
      item: "Project Timeline",
      time: "2h ago",
    },
  ];

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "team", label: "Team", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">IT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">IfTheyDo</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>

              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-sm w-48"
                  />
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userName.split(" ")[0]}! 👋
            </h2>
            <p className="text-gray-600">
              Here's what's happening with your projects today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        stat.trend.startsWith("+")
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">
                        {activity.user.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{activity.user}</span>{" "}
                        <span className="text-gray-600">{activity.action}</span>{" "}
                        <span className="font-semibold">{activity.item}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all">
                  Create New Task
                </button>
                <button className="w-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all">
                  Invite Team Member
                </button>
                <button className="w-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all">
                  View Reports
                </button>
              </div>

              {/* Alert */}
              <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-orange-900">
                      Action Required
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      3 tasks are due today. Review and update their status.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
