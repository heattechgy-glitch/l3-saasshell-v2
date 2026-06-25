import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { LayoutDashboard, Settings, User, LogOut, Menu, X } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        navigate("/login");
        return;
      }
      setUser(user);
    } catch (err) {
      console.error("Error checking user:", err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", active: true },
    { icon: Settings, label: "Settings", path: "/settings", active: false },
    { icon: User, label: "Profile", path: "/profile", active: false }
  ];

  const stats = [
    { label: "Total Users", value: "2,543", change: "+12.5%", positive: true },
    { label: "Revenue", value: "$45,231", change: "+8.2%", positive: true },
    { label: "Active Projects", value: "18", change: "-2.4%", positive: false }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
            <h1 className="text-xl font-bold text-sky-500">SaaSShell</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active
                      ? "bg-sky-500/10 text-sky-500"
                      : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User info & sign out */}
          <div className="p-4 border-t border-gray-800">
            <div className="mb-3 px-4 py-2 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Signed in as</p>
              <p className="text-sm text-gray-100 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-100">Dashboard</h2>
          <div className="w-10 lg:w-0"></div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          {/* Welcome message */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-100 mb-2">
              Welcome back!
            </h3>
            <p className="text-gray-400">
              Here's what's happening with your account today.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
              >
                <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-100 mb-3">
                  {stat.value}
                </p>
                <p
                  className={`text-sm font-medium ${
                    stat.positive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Placeholder content */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-100 mb-4">
              Recent Activity
            </h4>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-sky-500/20 rounded-full flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-sky-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-100">
                      Activity item {item}
                    </p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;