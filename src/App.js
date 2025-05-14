import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Header from './components/layout/Header';
import Recipes from './pages/Recipes';
import RecipeDetails from './pages/RecipeDetails';
import ShoppingList from './pages/ShoppingList';
import WeeklyReport from './pages/WeeklyReport';
import MealPlanner from './pages/MealPlanner';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import OnboardingContainer from './pages/onboarding/OnboardingContainer';
import OnboardingGoals from './pages/onboarding/OnboardingGoals';
import OnboardingBody from './pages/onboarding/OnboardingBody';
import OnboardingDiet from './pages/onboarding/OnboardingDiet';
import OnboardingSchedule from './pages/onboarding/OnboardingSchedule';
import OnboardingBudget from './pages/onboarding/OnboardingBudget';
import { AuthProvider, useAuth } from './AuthContext';
import './styles.css';

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  return (
    <Router>
      {isAuthenticated && <Header />}
      <main className={`main-container ${!isAuthenticated ? 'full-height' : 'with-header'}`}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Onboarding Routes */}
          <Route path="/onboarding" element={<OnboardingContainer />}>
            <Route index element={<Navigate to="goals" replace />} />
            <Route path="goals" element={<OnboardingGoals />} />
            <Route path="body" element={<OnboardingBody />} />
            <Route path="diet" element={<OnboardingDiet />} />
            <Route path="schedule" element={<OnboardingSchedule />} />
            <Route path="budget" element={<OnboardingBudget />} />
          </Route>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/meal-planner" element={<ProtectedRoute><MealPlanner /></ProtectedRoute>} />
          <Route path="/recipes">
            <Route index element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
            <Route path=":recipeId" element={<ProtectedRoute><RecipeDetails /></ProtectedRoute>} />
          </Route>
          <Route path="/shopping-list" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />
          <Route path="/weekly-report" element={<ProtectedRoute><WeeklyReport /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </main>
    </Router>
  );
}

function App() {
  return (
    <RecoilRoot>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </RecoilRoot>
  );
}

export default App;
