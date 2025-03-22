"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import Layout from "../components/Layout"
import DeleteConfirmModal from "../components/DeleteConfirmModal"
import api from "../utils/api"
import { Search, CheckCircle, Clock, AlertCircle } from "lucide-react"

const ContactSubmissions = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContact, setSelectedContact] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [expandedContact, setExpandedContact] = useState(null)
  const [editingNotes, setEditingNotes] = useState(null)
  const [adminNotes, setAdminNotes] = useState("")

  const fetchContacts = async () => {
    setLoading(true)
    try {
      let url = `/admin/contacts?page=${currentPage}`
      if (statusFilter) url += `&status=${statusFilter}`
      if (searchTerm) url += `&search=${searchTerm}`

      const res = await api.get(url)
      setContacts(res.data.contacts)
      setTotalPages(res.data.pagination.pages)
    } catch (err) {
      console.error("Error fetching contacts:", err)
      setError("Failed to load contact submissions. Please try again.")
      toast.error("Failed to load contact submissions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [currentPage, statusFilter, searchTerm])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/contacts/${id}`, { status: newStatus })
      setContacts(contacts.map((contact) => (contact._id === id ? { ...contact, status: newStatus } : contact)))
      toast.success("Status updated successfully")
    } catch (err) {
      console.error("Error updating status:", err)
      toast.error("Failed to update status")
    }
  }

  const handleDeleteClick = (contact) => {
    setSelectedContact(contact)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedContact) return

    try {
      await api.delete(`/admin/contacts/${selectedContact._id}`)
      setContacts(contacts.filter((c) => c._id !== selectedContact._id))
      toast.success("Contact deleted successfully")
      setShowDeleteModal(false)
    } catch (err) {
      console.error("Error deleting contact:", err)
      toast.error("Failed to delete contact")
    }
  }

  const handleExpandContact = (id) => {
    setExpandedContact(expandedContact === id ? null : id)
  }

  const handleEditNotes = (contact) => {
    setEditingNotes(contact._id)
    setAdminNotes(contact.adminNotes || "")
  }

  const handleSaveNotes = async (id) => {
    try {
      await api.put(`/admin/contacts/${id}`, { adminNotes })
      setContacts(contacts.map((contact) => (contact._id === id ? { ...contact, adminNotes } : contact)))
      setEditingNotes(null)
      toast.success("Notes updated successfully")
    } catch (err) {
      console.error("Error updating notes:", err)
      toast.error("Failed to update notes")
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return null
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
          <button
            onClick={fetchContacts}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Try Again
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Contact Submissions</h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  placeholder="Search contacts..."
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition duration-300"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">No contact submissions found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Subject
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <>
                      <tr key={contact._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{contact.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 truncate max-w-xs">{contact.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(contact.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(contact.status)}`}
                          >
                            {getStatusIcon(contact.status)}
                            <span className="ml-1.5">
                              {contact.status === "new"
                                ? "New"
                                : contact.status === "in-progress"
                                  ? "In Progress"
                                  : "Resolved"}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleExpandContact(contact._id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            {expandedContact === contact._id ? "Hide" : "View"}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(contact)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>

                      {expandedContact === contact._id && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Message:</h4>
                                <p className="text-sm text-gray-600 whitespace-pre-line">{contact.message}</p>
                              </div>

                              {contact.phone && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-1">Phone:</h4>
                                  <p className="text-sm text-gray-600">{contact.phone}</p>
                                </div>
                              )}

                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Admin Notes:</h4>
                                {editingNotes === contact._id ? (
                                  <div className="mt-1">
                                    <textarea
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                      rows="3"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ></textarea>
                                    <div className="mt-2 flex space-x-2">
                                      <button
                                        onClick={() => handleSaveNotes(contact._id)}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition duration-300"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingNotes(null)}
                                        className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 transition duration-300"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-start">
                                    <p className="text-sm text-gray-600 whitespace-pre-line flex-grow">
                                      {contact.adminNotes || "No notes added yet."}
                                    </p>
                                    <button
                                      onClick={() => handleEditNotes(contact)}
                                      className="ml-2 text-blue-600 hover:text-blue-900 text-sm"
                                    >
                                      Edit
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Update Status:</h4>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleUpdateStatus(contact._id, "new")}
                                    className={`px-3 py-1 text-xs rounded-md ${
                                      contact.status === "new"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    } transition duration-300`}
                                  >
                                    New
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(contact._id, "in-progress")}
                                    className={`px-3 py-1 text-xs rounded-md ${
                                      contact.status === "in-progress"
                                        ? "bg-yellow-500 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    } transition duration-300`}
                                  >
                                    In Progress
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(contact._id, "resolved")}
                                    className={`px-3 py-1 text-xs rounded-md ${
                                      contact.status === "resolved"
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    } transition duration-300`}
                                  >
                                    Resolved
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {[...Array(totalPages).keys()].map((page) => (
                        <button
                          key={page + 1}
                          onClick={() => handlePageChange(page + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === page + 1
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          } text-sm font-medium`}
                        >
                          {page + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          title="Delete Contact"
          message={`Are you sure you want to delete the contact from ${selectedContact?.name}? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </Layout>
  )
}

export default ContactSubmissions

