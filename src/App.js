import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Header from './components/layout/Header';
import Recipes from './pages/Recipes';
import RecipeDetails from './pages/RecipeDetails';
import ShoppingList from './pages/ShoppingList';
import WeeklyReport from './pages/WeeklyReport';
import MealPlanner from './pages/MealPlanner';
import Dashboard from './pages/Dashboard';
import './styles.css';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <div className="app">
          <Header />
          <main className="main container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipe-details/:recipeId" element={<RecipeDetails />} />
              <Route path="/shopping-list" element={<ShoppingList />} />
              <Route path="/weekly-report" element={<WeeklyReport />} />
            </Routes>
          </main>
        </div>
      </Router>
    </RecoilRoot>
  );
}

export default App;
