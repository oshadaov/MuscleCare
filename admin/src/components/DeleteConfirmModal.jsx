"use client"

import { X } from "lucide-react"

const DeleteConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal

