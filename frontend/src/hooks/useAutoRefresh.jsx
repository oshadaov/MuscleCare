"use client"

import { useEffect } from "react"

/**
 * Hook to automatically refresh the page after a specified interval
 * @param {number} refreshInterval - Refresh interval in milliseconds (default: 60000ms = 1 minute)
 */
const useAutoRefresh = (refreshInterval = 120000) => {
  useEffect(() => {
    // Set up the timer
    const timer = setTimeout(() => {
      window.location.reload()
    }, refreshInterval)

    // Clean up the timer when component unmounts
    return () => clearTimeout(timer)
  }, [refreshInterval])
}

export default useAutoRefresh

