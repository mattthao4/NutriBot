import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import '../../styles/theme.css';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Meal Planner', href: '/meal-planner' },
    { name: 'Shopping List', href: '/shopping-list' },
    { name: 'Weekly Report', href: '/weekly-report' }
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/" className="logo-link">
            <span className="logo-text">NutriBot</span>
          </Link>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            {navigation.map((item) => (
              <li key={item.name} className="nav-item">
                <Link
                  to={item.href}
                  className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button className="btn" aria-label="Help">
          <QuestionMarkCircleIcon className="icon" />
        </button>
      </div>
    </header>
  );
};

export default Header; 