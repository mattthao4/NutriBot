import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MealPlanner.css';
import '../styles/theme.css';

const MealPlanner = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState({
    monday: { breakfast: '', lunch: '', dinner: '' },
    tuesday: { breakfast: '', lunch: '', dinner: '' },
    wednesday: { breakfast: '', lunch: '', dinner: '' },
    thursday: { breakfast: '', lunch: '', dinner: '' },
    friday: { breakfast: '', lunch: '', dinner: '' },
    saturday: { breakfast: '', lunch: '', dinner: '' },
    sunday: { breakfast: '', lunch: '', dinner: '' }
  });

  const handleAddMeal = (day, mealType) => {
    // Store the day and meal type in session storage to use in recipes page
    sessionStorage.setItem('selectedDay', day);
    sessionStorage.setItem('selectedMealType', mealType);
    navigate('/recipes');
  };

  const handleMealChange = (day, mealType, value) => {
    setMeals(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: value
      }
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving meal plan:', meals);
  };

  const handleClear = () => {
    setMeals({
      monday: { breakfast: '', lunch: '', dinner: '' },
      tuesday: { breakfast: '', lunch: '', dinner: '' },
      wednesday: { breakfast: '', lunch: '', dinner: '' },
      thursday: { breakfast: '', lunch: '', dinner: '' },
      friday: { breakfast: '', lunch: '', dinner: '' },
      saturday: { breakfast: '', lunch: '', dinner: '' },
      sunday: { breakfast: '', lunch: '', dinner: '' }
    });
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  return (
    <div className="dashboard">
      <div className="page-background" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }} />
      <div className="page-content-wrapper">
        <div className="page-header">
          <h1>Weekly Meal Planner</h1>
          <div className="dashboard-actions">
            <button className="button button-success">
              <span className="icon">💾</span>
              Save Plan
            </button>
            <button className="button button-danger">
              <span className="icon">🗑️</span>
              Clear All
            </button>
          </div>
        </div>
        
        <div className="dashboard-content">
          <div className="meal-planner-grid">
            <div className="grid-header">
              <div className="day-header">Day</div>
              <div className="meal-header">
                <span className="meal-icon">🍳</span>
                Breakfast
              </div>
              <div className="meal-header">
                <span className="meal-icon">🥪</span>
                Lunch
              </div>
              <div className="meal-header">
                <span className="meal-icon">🍽️</span>
                Dinner
              </div>
            </div>
            {days.map(day => (
              <div key={day} className="day-row">
                <div className="day-cell">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                {mealTypes.map(mealType => (
                  <div key={mealType} className="meal-cell">
                    {meals[day][mealType] ? (
                      <div className="meal-content">
                        <span>{meals[day][mealType]}</span>
                        <button 
                          className="button button-primary"
                          onClick={() => handleAddMeal(day, mealType)}
                        >
                          <span className="icon">✏️</span>
                          Edit
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="button button-primary"
                        onClick={() => handleAddMeal(day, mealType)}
                      >
                        <span className="icon">➕</span>
                        Add Meal
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="dashboard-sidebar">
            <div className="card">
              <h3>Quick Stats</h3>
              <div className="stats-card">
                <div className="stat-item">
                  <span className="icon">📊</span>
                  <p>Total Meals Planned: 0</p>
                </div>
                <div className="stat-item">
                  <span className="icon">📝</span>
                  <p>Recipes Used: 0</p>
                </div>
                <div className="stat-item">
                  <span className="icon">⚖️</span>
                  <p>Calories per Day: 0</p>
                </div>
              </div>
            </div>
            <div className="card">
              <h3>Upcoming Groceries</h3>
              <div className="grocery-list">
                <div className="empty-state">
                  <span className="empty-state-icon">🛒</span>
                  <p>No items added yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner; 