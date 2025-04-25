import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
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
    // Store the selected meal slot in session storage
    sessionStorage.setItem('selectedMealSlot', JSON.stringify({ day, mealType }));
    navigate('/recipes');
  };

  const handleRemoveMeal = (e, day, mealType, recipeId) => {
    e.stopPropagation(); // Prevent the meal slot click from firing
    
    const updatedMealPlan = { ...mealPlan };
    
    if (updatedMealPlan[day] && updatedMealPlan[day][mealType]) {
      // Remove the recipe from the meal type
      updatedMealPlan[day][mealType] = updatedMealPlan[day][mealType].filter(
        recipe => recipe.id !== recipeId
      );
      
      // If no recipes left for this meal type, remove the meal type
      if (updatedMealPlan[day][mealType].length === 0) {
        delete updatedMealPlan[day][mealType];
      }
      
      // If no meal types left for this day, remove the day
      if (Object.keys(updatedMealPlan[day]).length === 0) {
        delete updatedMealPlan[day];
      }
      
      // Save updated meal plan
      sessionStorage.setItem('mealPlan', JSON.stringify(updatedMealPlan));
      setMealPlan(updatedMealPlan);
    }
  };

  const handleClearAll = () => {
    // Clear the meal plan
    sessionStorage.removeItem('mealPlan');
    setMealPlan({});
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
                <button
                  onClick={(e) => handleRemoveMeal(e, day, mealType, recipe.id)}
                  className="remove-meal-button"
                  aria-label="Remove meal"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
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
      <div className="page-background" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }} />
      <div className="page-content-wrapper">
        <div className="page-header">
          <h1>Weekly Meal Planner</h1>
          <div className="page-actions">
            <button className="button button-success">
              <span className="icon">💾</span>
              Save Plan
            </button>
            <button 
              className="button button-danger"
              onClick={handleClearAll}
            >
              <span className="icon">🗑️</span>
              Clear All
            </button>
          </div>
        </div>
        
        <div className="meal-planner-grid">
          <div className="grid-header">
            <div className="day-header">Day</div>
            {mealTypes.map(mealType => (
              <div key={mealType} className="meal-header">
                <span className="meal-icon">
                  {mealType === 'Breakfast' ? '🍳' : 
                   mealType === 'Lunch' ? '🥪' : 
                   mealType === 'Dinner' ? '🍽️' : '🍎'}
                </span>
                {mealType}
              </div>
            ))}
          </div>
          
          {days.map(day => (
            <div key={day} className="day-row">
              <div className="day-cell">{day}</div>
              {mealTypes.map(mealType => (
                <div key={`${day}-${mealType}`} className="meal-cell">
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