import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';
import './MealPlanner.css';

const MealPlanner = () => {
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState({});

  useEffect(() => {
    // Load meal plan from session storage
    const savedMealPlan = JSON.parse(sessionStorage.getItem('mealPlan') || '{}');
    setMealPlan(savedMealPlan);
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const handleMealSlotClick = (day, mealType) => {
    navigate(`/meal-planner/recipes?day=${day.toLowerCase()}&mealType=${mealType.toLowerCase()}`);
  };

  const renderMealSlot = (day, mealType) => {
    const recipes = mealPlan[day]?.[mealType] || [];
    
    return (
      <div 
        className="meal-slot"
        onClick={() => handleMealSlotClick(day, mealType)}
      >
        {recipes.length > 0 ? (
          <div className="meal-slot-content">
            {recipes.map((recipe, index) => (
              <div key={index} className="meal-item">
                <div 
                  className="meal-item-image"
                  style={{ backgroundImage: `url(${recipe.image})` }}
                />
                <div className="meal-item-info">
                  <h4>{recipe.name}</h4>
                  <div className="meal-item-meta">
                    <span>{recipe.calories} cal</span>
                    <span>{recipe.prepTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-slot">
            <span className="icon">➕</span>
            <span>Add {mealType}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="meal-planner-page">
      <div className="page-background" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490645930917-897ecb06fdf4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }} />
      <div className="page-content-wrapper">
        <h1>Meal Planner</h1>
        <div className="meal-grid">
          <div className="meal-grid-header">
            <div className="header-cell">Day</div>
            {mealTypes.map(mealType => (
              <div key={mealType} className="header-cell">{mealType}</div>
            ))}
          </div>
          {days.map(day => (
            <div key={day} className="meal-grid-row">
              <div className="day-cell">{day}</div>
              {mealTypes.map(mealType => (
                <div key={mealType} className="meal-cell">
                  {renderMealSlot(day, mealType)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealPlanner; 