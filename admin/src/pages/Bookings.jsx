import { useState, useEffect } from "react";
import { Search, Filter, Calendar, Clock, User, Tag, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import api from "../utils/api";
import ConfirmationModal from "../components/ConfirmationModal";
import toast from "react-hot-toast";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, dateFilter, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/bookings");
      setBookings(response.data);
      setFilteredBookings(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.date).toDateString();
        return bookingDate === filterDate;
      });
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.name.toLowerCase().includes(term) ||
          booking.treatment.toLowerCase().includes(term) ||
          (booking.user?.name && booking.user.name.toLowerCase().includes(term))
      );
    }

    setFilteredBookings(filtered);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/admin/bookings/${bookingId}`, { status: newStatus });
      setBookings(bookings.map((booking) => (booking._id === bookingId ? { ...booking, status: newStatus } : booking)));
      toast.success(`Booking status updated to ${newStatus}`);
      setShowActionMenu(null);
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast.error("Failed to update booking status");
    }
  };

  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteModal(true);
    setShowActionMenu(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/bookings/${bookingToDelete._id}`);
      setBookings(bookings.filter((booking) => booking._id !== bookingToDelete._id));
      toast.success("Booking deleted successfully");
    } catch (err) {
      console.error("Error deleting booking:", err);
      toast.error("Failed to delete booking");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookings..."
                className="pl-10 pr-4 py-2 border rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-10 py-2 border rounded-md w-full bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-3 pr-4 py-2 border rounded-md w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No bookings found matching your filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Date & Time
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Patient
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      Treatment
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatDate(booking.date)}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {booking.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                      <div className="text-sm text-gray-500">{booking.user?.email || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.treatment}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === booking._id ? null : booking._id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>

                        {showActionMenu === booking._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            <button
                              onClick={() => handleStatusChange(booking._id, "confirmed")}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <CheckCircle className="h-4 w-4 inline mr-2 text-green-500" />
                              Mark as Confirmed
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking._id, "completed")}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <CheckCircle className="h-4 w-4 inline mr-2 text-blue-500" />
                              Mark as Completed
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking._id, "cancelled")}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <XCircle className="h-4 w-4 inline mr-2 text-red-500" />
                              Mark as Cancelled
                            </button>
                            <hr className="my-1" />
                            <button
                              onClick={() => handleDeleteClick(booking)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete Booking
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Booking"
        message={`Are you sure you want to delete the booking for ${bookingToDelete?.name || "this patient"}? This action cannot be undone.`}
      />
    </div>
  );
}

export default Bookings;
