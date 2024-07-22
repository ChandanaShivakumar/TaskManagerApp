import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../Style/navbar.css';
import { FaHome, FaStickyNote } from 'react-icons/fa';
import { MdWavingHand } from 'react-icons/md';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-primary">
      <div className="navbar-brand">
        <Link to="/">
          <FaHome style={{ marginLeft: '8px', color: 'white' }} />
        </Link>
        {isAuthenticated && (
          <Link to={`/user/${user.id}/task`}>
            <FaStickyNote style={{ marginLeft: '20px', color: 'white' }} />
          </Link>
        )}
      </div>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          {isAuthenticated ? (
            <>
              <li className="navbar-brand">
                <h6 className="welcome-link"><MdWavingHand/>Hi, {user.firstname}</h6>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={logout}>Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
