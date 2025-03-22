import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Users from "./pages/Users";
import Feedback from "./pages/Feedback";
import Services from "./pages/Services";
import ServiceForm from "./pages/ServiceForm";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import AdminBookingsPage from "./pages/AdminBookingsPage"
import ContactSubmissions from "./pages/ContactSubmissions";
import Videos from "./pages/Videos";
import RotatorImagesPage from "./pages/RotatorImages";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/bookings" element={
            <PrivateRoute>
              <Layout>
                <Bookings />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/users" element={
            <PrivateRoute>
              <Layout>
                <Users />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/feedback" element={
            <PrivateRoute>
              <Layout>
                <Feedback />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/services" element={
            
              <Layout>
                <Services />
              </Layout>
           
          } />
          
          <Route path="/services/new" element={
            <PrivateRoute>
              <Layout>
                <ServiceForm />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/services/edit/:id" element={
            <PrivateRoute>
              <Layout>
                <ServiceForm />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/settings" element={
            <PrivateRoute>
              <Layout>
                <Settings />
              </Layout>
            </PrivateRoute>
          } />
                <Route path="/videos" element={
            <PrivateRoute>
              <Layout>
                <Videos />
              </Layout>
            </PrivateRoute>
          } />
     
     <Route path="/images" element={
            <PrivateRoute>
              <Layout>
                <RotatorImagesPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/contacts" element={<ContactSubmissions/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
