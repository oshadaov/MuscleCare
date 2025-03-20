"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, X } from "lucide-react"
import api from "../utils/api"
import { toast } from "react-hot-toast"

function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = id !== undefined

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fullDescription: "",
    extra:"",
    duration: "",
    price: "",
    benefits: [""],
    rating: 0,
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isEditMode) {
      fetchService()
    }
  }, [isEditMode, id])

  const fetchService = async () => {
    try {
      const response = await api.get(`/services/${id}`)
      const service = response.data

      setFormData({
        name: service.name || "",
        description: service.description || "",
        extra: service.extra || "",
        fullDescription: service.fullDescription || "",
        duration: service.duration || "",
        price: service.price || "",
        benefits: service.benefits?.length > 0 ? service.benefits : [""],
        rating: service.rating || 0,
      })

      if (service.imageUrl) {
        setImagePreview(service.imageUrl)
      }

      setError("")
    } catch (err) {
      console.error("Error fetching service details:", err)
      setError("Failed to fetch service details. Please try again.")
      toast.error("Failed to fetch service details")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBenefitChange = (index, value) => {
    const updatedBenefits = [...formData.benefits]
    updatedBenefits[index] = value
    setFormData((prev) => ({
      ...prev,
      benefits: updatedBenefits,
    }))
  }

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ""],
    }))
  }

  const removeBenefit = (index) => {
    if (formData.benefits.length === 1) return

    const updatedBenefits = formData.benefits.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      benefits: updatedBenefits,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    //Validate required fields
    if (!formData.name || !formData.description || !formData.fullDescription || !formData.duration || !formData.price) {
      setError("Please fill in all required fields");
      return;
    }
  
    // Filter out empty benefits
    const filteredBenefits = formData.benefits.filter((benefit) => benefit.trim() !== "");
  
    try {
      setSubmitting(true);
      setError("");
  
      // Create FormData object for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("fullDescription", formData.fullDescription);
      submitData.append("duration", formData.duration);
      submitData.append("price", formData.price);
      submitData.append("rating", formData.rating);
  
      // Add extra only if it's filled
      if (formData.extra.trim() !== "") {
        submitData.append("extra", formData.extra);
      }
  
      // Add benefits as JSON string
      submitData.append("benefits", JSON.stringify(filteredBenefits));
  
      // Add image if selected
      if (imageFile) {
        submitData.append("image", imageFile);
      }
  
      if (isEditMode) {
        await api.put(`/services/${id}`, submitData);
        toast.success("Service updated successfully");
      } else {
        await api.post("/services", submitData);
        toast.success("Service created successfully");
      }
  
      navigate("/services");
    } catch (err) {
      console.error("Service submission error:", err);
      setError(`Failed to ${isEditMode ? "update" : "create"} service. ${err.response?.data?.message || "Please try again."}`);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} service`);
    } finally {
      setSubmitting(false);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/services")}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Services
      </button>

      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Service" : "Add New Service"}</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6" encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Service Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Short Description *
              </label>
              <input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
              <p className="text-gray-500 text-xs mt-1">Brief description shown in service cards</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="extra">
                 Extra *
              </label>
              <input
                id="extra"
                name="extra"
                type="text"
                value={formData.extra}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                
              />
              <p className="text-gray-500 text-xs mt-1">Brief description shown in service cards</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullDescription">
                Full Description *
              </label>
              <textarea
                id="fullDescription"
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="5"
                required
              ></textarea>
              <p className="text-gray-500 text-xs mt-1">Detailed description shown on service detail page</p>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                Service Image
              </label>
              <div className="flex items-center">
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-md border border-blue-300"
                >
                  {imagePreview ? "Change Image" : "Upload Image"}
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview("")
                    }}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                  Duration *
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="text"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 30-45 minutes"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Price *
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. $60-$80"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                Rating (0-5)
              </label>
              <input
                id="rating"
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Benefits</label>

          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleBenefitChange(index, e.target.value)}
                placeholder={`Benefit ${index + 1}`}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <button
                type="button"
                onClick={() => removeBenefit(index)}
                className="ml-2 text-red-600 hover:text-red-800"
                disabled={formData.benefits.length === 1}
              >
                <X size={18} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addBenefit}
            className="flex items-center text-blue-600 hover:text-blue-800 mt-2"
          >
            <Plus size={16} className="mr-1" />
            Add Benefit
          </button>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/services")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={submitting}
          >
            {submitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                {isEditMode ? "Updating..." : "Creating..."}
              </div>
            ) : isEditMode ? (
              "Update Service"
            ) : (
              "Create Service"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ServiceForm

