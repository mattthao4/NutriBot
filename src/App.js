import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Recipes from './pages/Recipes';
import ShoppingList from './pages/ShoppingList';
import WeeklyReport from './pages/WeeklyReport';
import MealPlanner from './components/MealPlanner';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main container">
          <Routes>
            <Route path="/" element={<MealPlanner />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="/weekly-report" element={<WeeklyReport />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
