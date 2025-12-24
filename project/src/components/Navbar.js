import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../App.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <header>
      <nav className="navbar">
        <div className="nav-brand">
          <Link to={user ? "/home" : "/login"}>PC Parts Shop</Link>
        </div>
        <button 
          className={`menu-btn ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          ☰
        </button>
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <li><Link to="/home" onClick={() => setMenuOpen(false)}>Home</Link></li>
              <li><Link to="/cpus" onClick={() => setMenuOpen(false)}>CPUs</Link></li>
              <li><Link to="/gpus" onClick={() => setMenuOpen(false)}>GPUs</Link></li>
              <li><Link to="/ram" onClick={() => setMenuOpen(false)}>RAM</Link></li>
              <li><Link to="/storage" onClick={() => setMenuOpen(false)}>Storage</Link></li>
              <li><Link to="/powersupplies" onClick={() => setMenuOpen(false)}>Power Supplies</Link></li>
              <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link></li>
              <li>
                <Link to="/cart" onClick={() => setMenuOpen(false)} className="cart-link">
                  Cart
                  {getCartItemsCount() > 0 && (
                    <span className="cart-count">{getCartItemsCount()}</span>
                  )}
                </Link>
              </li>
              <li className="user-info">
                <span>Welcome, {user.username}</span>
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
              <li><Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;