import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Header from './components/layout/Header';
import Recipes from './pages/Recipes';
import ShoppingList from './pages/ShoppingList';
import WeeklyReport from './pages/WeeklyReport';
import MealPlanner from './pages/MealPlanner';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import './styles.css';

// A simple check for authentication status (you can make this more robust)
const isAuthenticated = () => {
  // For this demo, we'll just check if onboarding is marked as complete
  // In a real app, you'd check for a valid token or session
  return localStorage.getItem('hasCompletedOnboarding') === 'true';
};

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <RecoilRoot>
      <Router>
        {/* Conditionally render Header based on authentication or route */}
        {/* For simplicity, we might need a more sophisticated way to hide Header on LoginPage */}
        {/* This basic check will hide it if not authenticated, which covers LoginPage */}
        {isAuthenticated() && <Header />}
        <main className={`main-container ${!isAuthenticated() ? 'full-height' : ''}`}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/meal-planner" 
              element={
                <ProtectedRoute>
                  <MealPlanner />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recipes" 
              element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/shopping-list" 
              element={
                <ProtectedRoute>
                  <ShoppingList />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/weekly-report" 
              element={
                <ProtectedRoute>
                  <WeeklyReport />
                </ProtectedRoute>
              }
            />
            {/* Add other protected routes here */}
            <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </main>
      </Router>
    </RecoilRoot>
  );
}

export default App;
