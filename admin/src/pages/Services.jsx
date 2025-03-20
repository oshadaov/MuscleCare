"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import api from "../utils/api"
import ConfirmationModal from "../components/ConfirmationModal"
import { toast } from "react-hot-toast"

function Services() {
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    filterServices()
  }, [searchTerm, services])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await api.get("/admin/services")
      setServices(response.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching services:", err)
      setError("Failed to load services. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filterServices = () => {
    if (!searchTerm) {
      setFilteredServices(services)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = services.filter(
      (service) => service.name?.toLowerCase().includes(term) || service.description?.toLowerCase().includes(term),
    )
    setFilteredServices(filtered)
  }

  const handleDeleteClick = (service) => {
    setServiceToDelete(service)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/services/${serviceToDelete._id}`)
      setServices(services.filter((service) => service._id !== serviceToDelete._id))
      toast.success("Service deleted successfully")
    } catch (err) {
      console.error("Error deleting service:", err)
      toast.error("Failed to delete service")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Services</h1>
        <Link
          to="/services/new"
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-5 w-5 mr-1" />
          Add Service
        </Link>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search services..."
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Services List */}
      {filteredServices.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No services found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Link
                    to={`/services/edit/${service._id}`}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                    title="Edit service"
                  >
                    <Edit className="h-4 w-4 text-gray-600" />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(service)}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                    title="Delete service"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{service.name}</h2>
                <p className="text-gray-600 mt-1 text-sm line-clamp-2">{service.description}</p>

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">{service.duration}</div>
                  <div className="text-sm font-medium text-primary">{service.price}</div>
                </div>

                <div className="mt-2 flex items-center">
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(service.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-500">({service.rating || 0})</span>
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
        title="Delete Service"
        message={`Are you sure you want to delete "${serviceToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}

export default Services

