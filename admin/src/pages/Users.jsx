"use client"

import { useState, useEffect } from "react"
import { Search, Mail, Phone, Calendar, Trash2 } from "lucide-react"
import api from "../utils/api"
import ConfirmationModal from "../components/ConfirmationModal"

function Users() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/admin/users")
      setUsers(response.data)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = users.filter(
      (user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term),
    )
    setFilteredUsers(filtered)
  }

  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/users/${userToDelete._id}`)
      setUsers(users.filter((user) => user._id !== userToDelete._id))
    } catch (err) {
      console.error("Error deleting user:", err)
      alert("Failed to delete user")
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No users found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center text-gray-600 mt-1">
                        <Phone className="h-4 w-4 mr-1" />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete user"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">Joined: {formatDate(user.createdAt)}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">Total Bookings: {user.bookingsCount || 0}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => (window.location.href = `/bookings?user=${user._id}`)}
                    className="text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    View Bookings
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This will also delete all their bookings and feedback. This action cannot be undone.`}
      />
    </div>
  )
}

export default Users

