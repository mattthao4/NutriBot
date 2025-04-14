import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

function Header() {
  const location = useLocation();
  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Recipes', href: '/recipes' },
    { name: 'Shopping List', href: '/shopping-list' },
    { name: 'Weekly Report', href: '/weekly-report' },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div>
          <Link to="/" className="logo">
            NutriBot
          </Link>
        </div>

        <nav className="nav">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button className="btn" aria-label="Help">
          <QuestionMarkCircleIcon className="icon" />
        </button>
      </div>
    </header>
  );
}

export default Header; 