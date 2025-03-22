import { useState, useEffect } from "react";
import { Users, Calendar, MessageSquare, Package } from 'lucide-react';
import Card from "../components/Card";
import api from "../utils/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalServices: 0,
    totalFeedback: 0,
    bookingsByStatus: {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/dashboard/stats");
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<Calendar className="h-6 w-6" />}
          color="blue"
        />
        <Card
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6" />}
          color="green"
        />
        <Card
          title="Total Services"
          value={stats.totalServices}
          icon={<Package className="h-6 w-6" />}
          color="purple"
        />
        <Card
          title="Total Feedback"
          value={stats.totalFeedback}
          icon={<MessageSquare className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Booking Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-500 font-medium">Pending</div>
              <div className="text-2xl font-bold">{stats.bookingsByStatus.pending}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-500 font-medium">Confirmed</div>
              <div className="text-2xl font-bold">{stats.bookingsByStatus.confirmed}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-yellow-500 font-medium">Completed</div>
              <div className="text-2xl font-bold">{stats.bookingsByStatus.completed || 0}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-red-500 font-medium">Cancelled</div>
              <div className="text-2xl font-bold">{stats.bookingsByStatus.cancelled}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-medium">New booking received</div>
                <div className="text-xs text-gray-500">2 minutes ago</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-sm font-medium">New user registered</div>
                <div className="text-xs text-gray-500">1 hour ago</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-yellow-100 p-2 rounded-full mr-3">
                <MessageSquare className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <div className="text-sm font-medium">New feedback submitted</div>
                <div className="text-xs text-gray-500">3 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
