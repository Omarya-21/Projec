import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import CPUs from './pages/CPUs';
import GPUs from './pages/GPUs';
import RAM from './pages/RAM';
import Storage from './pages/Storage';
import PowerSupplies from './pages/PowerSupplies';
import Cart from './pages/Cart';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Navbar />
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cpus" element={<CPUs />} />
              <Route path="/gpus" element={<GPUs />} />
              <Route path="/ram" element={<RAM />} />
              <Route path="/storage" element={<Storage />} />
              <Route path="/powersupplies" element={<PowerSupplies />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;