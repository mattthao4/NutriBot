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
        <main className={`main-container ${!isAuthenticated() ? 'full-height' : 'with-header'}`}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Onboarding Routes */}
            <Route path="/onboarding" element={<OnboardingContainer />}>
              {/* Index route for onboarding could be a welcome or the first step */}
              <Route index element={<Navigate to="goals" replace />} /> 
              <Route path="goals" element={<OnboardingGoals />} />
              <Route path="body" element={<OnboardingBody />} />
              <Route path="diet" element={<OnboardingDiet />} />
              <Route path="schedule" element={<OnboardingSchedule />} />
              <Route path="budget" element={<OnboardingBudget />} />
            </Route>

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
            <Route path="/recipes">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Recipes />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":recipeId"
                element={
                  <ProtectedRoute>
                    <RecipeDetails />
                  </ProtectedRoute>
                }
              />
            </Route>
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
