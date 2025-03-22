import { Helmet } from "react-helmet-async";

import AllBookings from "../pages/Bookings"
import Layout from "../components/Layout"

function AdminBookingsPage() {
  return (
    <Layout>
      <Helmet>
        <title>Manage Bookings Muscle Care| Admin Dashboard</title>
      </Helmet>

      <div className="p-6">
        <AllBookings />
      </div>
    </Layout>
  )
}

export default AdminBookingsPage

