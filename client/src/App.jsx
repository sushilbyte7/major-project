import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import BookingForm from './pages/BookingForm';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProviderDetail from './pages/ProviderDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} />
            <Route path="/provider/:providerId" element={<ProviderDetail />} />

            {/* Protected User Routes */}
            <Route path="/book/:serviceId" element={
              <ProtectedRoute><BookingForm /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><UserDashboard /></ProtectedRoute>
            } />

            {/* Admin Only Routes */}
            <Route path="/admin" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />

            {/* 404 */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-screen text-slate-400">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl">Page not found</p>
              </div>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
