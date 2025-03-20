"use client"

import { useState, useEffect } from "react"
import { Save, Clock, Bell, Mail, DollarSign } from "lucide-react"

function Settings() {
  const [settings, setSettings] = useState({
    businessHours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "10:00", close: "15:00", closed: false },
      sunday: { open: "10:00", close: "15:00", closed: true },
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: true,
      bookingConfirmation: true,
      bookingReminder: true,
      marketingEmails: false,
    },
    general: {
      businessName: "Medical Treatment Center",
      contactEmail: "contact@example.com",
      contactPhone: "+1 (555) 123-4567",
      address: "123 Medical Ave, Health City, HC 12345",
    },
    payment: {
      currency: "USD",
      acceptCreditCards: true,
      acceptPayPal: false,
      depositRequired: false,
      depositAmount: 0,
    },
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      // In a real app, you would fetch settings from your API
      // const response = await api.get("/admin/settings");
      // setSettings(response.data);

      // For demo purposes, we'll just use the default settings
      setTimeout(() => {
        setLoading(false)
      }, 500)
    } catch (err) {
      console.error("Error fetching settings:", err)
      setError("Failed to load settings")
      setLoading(false)
    }
  }

  const handleChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleBusinessHoursChange = (day, field, value) => {
    if (field === "closed") {
      value = !settings.businessHours[day].closed
    }

    setSettings((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value,
        },
      },
    }))
  }

  const handleNotificationChange = (field) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field],
      },
    }))
  }

  const handlePaymentChange = (field, value) => {
    if (typeof value === "undefined") {
      value = !settings.payment[field]
    }

    setSettings((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)

      // In a real app, you would save settings to your API
      // await api.put("/admin/settings", settings);

      // For demo purposes, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccessMessage("Settings saved successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("Error saving settings:", err)
      setError("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "general" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "business-hours"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("business-hours")}
          >
            <Clock className="h-4 w-4 inline mr-1" />
            Business Hours
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "notifications"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="h-4 w-4 inline mr-1" />
            Notifications
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "payment" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("payment")}
          >
            <DollarSign className="h-4 w-4 inline mr-1" />
            Payment
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div>
              <h2 className="text-lg font-medium mb-4">General Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={settings.general.businessName}
                    onChange={(e) => handleChange("general", "businessName", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => handleChange("general", "contactEmail", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={settings.general.contactPhone}
                    onChange={(e) => handleChange("general", "contactPhone", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={settings.general.address}
                    onChange={(e) => handleChange("general", "address", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Business Hours */}
          {activeTab === "business-hours" && (
            <div>
              <h2 className="text-lg font-medium mb-4">Business Hours</h2>
              <div className="space-y-4">
                {days.map((day) => (
                  <div key={day.key} className="flex items-center space-x-4">
                    <div className="w-28">
                      <span className="font-medium">{day.label}</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`closed-${day.key}`}
                        checked={settings.businessHours[day.key].closed}
                        onChange={() => handleBusinessHoursChange(day.key, "closed")}
                        className="mr-2"
                      />
                      <label htmlFor={`closed-${day.key}`} className="text-sm">
                        Closed
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={settings.businessHours[day.key].open}
                        onChange={(e) => handleBusinessHoursChange(day.key, "open", e.target.value)}
                        disabled={settings.businessHours[day.key].closed}
                        className="px-3 py-2 border rounded-md"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={settings.businessHours[day.key].close}
                        onChange={(e) => handleBusinessHoursChange(day.key, "close", e.target.value)}
                        disabled={settings.businessHours[day.key].closed}
                        className="px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailEnabled}
                      onChange={() => handleNotificationChange("emailEnabled")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.smsEnabled}
                      onChange={() => handleNotificationChange("smsEnabled")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="font-medium">Booking Confirmations</h3>
                    <p className="text-sm text-gray-500">Send confirmation when a booking is made</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.bookingConfirmation}
                      onChange={() => handleNotificationChange("bookingConfirmation")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="font-medium">Booking Reminders</h3>
                    <p className="text-sm text-gray-500">Send reminders before appointments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.bookingReminder}
                      onChange={() => handleNotificationChange("bookingReminder")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="font-medium">Marketing Emails</h3>
                    <p className="text-sm text-gray-500">Send promotional emails to customers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.marketingEmails}
                      onChange={() => handleNotificationChange("marketingEmails")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === "payment" && (
            <div>
              <h2 className="text-lg font-medium mb-4">Payment Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={settings.payment.currency}
                    onChange={(e) => handlePaymentChange("currency", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="font-medium">Accept Credit Cards</h3>
                    <p className="text-sm text-gray-500">Allow payment via credit cards</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.payment.acceptCreditCards}
                      onChange={() => handlePaymentChange("acceptCreditCards")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="font-medium">Accept PayPal</h3>
                    <p className="text-sm text-gray-500">Allow payment via PayPal</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.payment.acceptPayPal}
                      onChange={() => handlePaymentChange("acceptPayPal")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="font-medium">Require Deposit</h3>
                    <p className="text-sm text-gray-500">Require a deposit for bookings</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.payment.depositRequired}
                      onChange={() => handlePaymentChange("depositRequired")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {settings.payment.depositRequired && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.payment.depositAmount}
                      onChange={(e) => handlePaymentChange("depositAmount", Number.parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-1" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Settings

